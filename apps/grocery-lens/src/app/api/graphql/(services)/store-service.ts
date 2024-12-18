import { Store } from "@/app/api/graphql/(types)/(objects)/store";
import { db } from "@/db/db";
import Dataloader from "dataloader";
import { sql } from "kysely";

const storeLoader = new Dataloader<string, Store>(
  async (ids) => {
    const data = await db.selectFrom("store").selectAll().where("id", "in", ids).execute();
    const dataMap = data.reduce<Record<string, Store>>((acc, store) => {
      acc[store.id] = store;
      return acc;
    }, {});
    return ids.map((id) => dataMap[id]!);
  },
  { cache: false },
);

const groceryItemsCountLoader = new Dataloader<string, number>(
  async (storeIds) => {
    const data = await db
      .selectFrom("grocery_item")
      .select("store_id")
      .select(sql<number>`count(*)`.as("count"))
      .where("store_id", "in", storeIds)
      .groupBy("store_id")
      .execute();
    const dataMap = data.reduce<Record<string, number>>((acc, { store_id, count }) => {
      acc[store_id] = count;
      return acc;
    }, {});
    return storeIds.map((id) => dataMap[id] || 0);
  },
  { cache: false },
);

export class StoreService {
  static getUserStores = async (userId: string) => {
    return db.selectFrom("store").selectAll().where("user_id", "=", userId).execute();
  };

  static getStoreByUserId = async (userId: string, storeId: string) => {
    const data = await db.selectFrom("store").selectAll().where("user_id", "=", userId).where("id", "=", storeId).execute();
    return data[0];
  };

  static addStore = async (userId: string, name: string) => {
    const result = await db.insertInto("store").values({ name, user_id: userId }).returningAll().execute();
    return result[0];
  };

  static getStoreById = async (id: string) => {
    return storeLoader.load(id);
  };

  static getGroceryItemsCount = async (storeId: string) => {
    return groceryItemsCountLoader.load(storeId);
  };
}
