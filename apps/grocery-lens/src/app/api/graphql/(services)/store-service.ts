import { UserService } from "@/app/api/graphql/(services)/user-service";
import { edgedbClient } from "@/edgedb";
import e from "@/edgedb/edgeql-js";
export class StoreService {
  static getStores = async (userId: string) => {
    return e
      .select(e.Store, (store) => ({
        id: true,
        name: true,
        filter: e.op(store.owner.id, "=", userId),
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
          })
        )
        .run(edgedbClient);
      return newStore;
    }
  };

  static getStoreQuery = (userId: string, name: string) =>
    e.select(e.Store, () => ({
      filter_single: { name, owner: UserService.getUserQuery(userId) },
    }));
}
