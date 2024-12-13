import { UserService } from "@/app/api/graphql/(services)/user-service";
import { Store } from "@/app/api/graphql/(types)/(objects)/store";
import { db } from "@/db/db";
import { edgedbClient } from "@/edgedb";
import e from "@/edgedb/edgeql-js";
import Dataloader from "dataloader";

const storeLoader = new Dataloader<string, Store>(async (ids) => {
  const data = await db
    .selectFrom("store")
    .selectAll()
    .where("id", "in", ids)
    .execute();
  const dataMap = data.reduce<Record<string, Store>>((acc, store) => {
    acc[store.id] = store;
    return acc;
  }, {});
  return ids.map((id) => dataMap[id]!);
});

export class StoreService {
  static getStores = async (userId: string) => {
    return e
      .select(e.Store, (store) => ({
        id: true,
        name: true,
        filter: e.op(store.owner.id, "=", e.uuid(userId)),
      }))
      .run(edgedbClient);
  };

  static addStore = async (userId: string, name: string) => {
    {
      const currentUser = UserService.getUserQuery(userId);
      const newStore = await e
        .select(
          e.insert(e.Store, {
            name,
            owner: currentUser,
          }),
          () => ({
            id: true,
            name: true,
          }),
        )
        .run(edgedbClient);
      return newStore;
    }
  };

  static getStoreQuery = (userId: string, name: string) =>
    e.select(e.Store, () => ({
      filter_single: { name, owner: UserService.getUserQuery(userId) },
    }));

  static getStoreById = async (id: string) => {
    return storeLoader.load(id);
  };
}
