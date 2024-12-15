import { LabelService } from "@/app/api/graphql/(services)/label-service";
import { StoreService } from "@/app/api/graphql/(services)/store-service";
import { CreateGroceryItemInput } from "@/app/api/graphql/(types)/(inputs)/create-grocery-item";
import { GroceryItemFilter } from "@/app/api/graphql/(types)/(inputs)/grocery-item-filter";
import { Pagination } from "@/app/api/graphql/(types)/(inputs)/pagination";
import { Label } from "@/app/api/graphql/(types)/(objects)/label";
import { db } from "@/db/db";
import DataLoader from "dataloader";

const groceryItemLabelDataloader = new DataLoader<string, Label[]>(
  async (groceryItemIds) => {
    const data = await db
      .selectFrom("grocery_item_label")
      .innerJoin("label", "label.id", "grocery_item_label.label_id")
      .selectAll("label")
      .select("grocery_item_label.grocery_item_id")
      .where("grocery_item_label.grocery_item_id", "in", groceryItemIds)
      .execute();
    const dataMap = data.reduce(
      (acc, { id, grocery_item_id, name }) => {
        acc[grocery_item_id] = acc[grocery_item_id] || [];
        acc[grocery_item_id].push({ id, name });
        return acc;
      },
      {} as Record<string, Label[]>,
    );
    return groceryItemIds.map((id) => dataMap[id] || []);
  },
);

export class GroceryItemService {
  static getGroceryItems = async (
    userId: string,
    { labels, stores, keyword }: GroceryItemFilter,
    { limit, offset }: Pagination,
  ) => {
    let query = db
      .selectFrom("grocery_item")
      .leftJoin("store", "grocery_item.store_id", "store.id")
      .leftJoin(
        "grocery_item_label",
        "grocery_item.id",
        "grocery_item_label.grocery_item_id",
      )
      .leftJoin("label", "grocery_item_label.label_id", "label.id")
      .selectAll("grocery_item")
      .distinct()
      .orderBy("grocery_item.created_at", "desc")
      .where("grocery_item.user_id", "=", userId);
    if (labels.length) {
      query = query.where("label.name", "in", labels);
    }
    if (stores.length) {
      query = query.where("store.name", "in", stores);
    }
    if (keyword) {
      query = query.where("grocery_item.name", "ilike", `%${keyword}%`);
    }
    const data = await query.limit(limit).offset(offset).execute();
    return data;
  };

  static getLabelsByGroceryItemId = async (groceryItemId: string) => {
    return groceryItemLabelDataloader.load(groceryItemId);
  };

  static addGroceryItem = async (
    userId: string,
    data: CreateGroceryItemInput,
  ) => {
    const store = await StoreService.getStoreByUserId(userId, data.storeId);
    if (!store) {
      throw new Error("Store not found");
    }
    const labels = await LabelService.getUserLabelsByIds(userId, data.labels);
    const newGroceryItem = await db.transaction().execute(async (tx) => {
      const result = await tx
        .insertInto("grocery_item")
        .values({
          name: data.itemName,
          user_id: userId,
          store_id: data.storeId,
          price: data.price,
          quantity: data.quantity,
          unit: data.unit,
          notes: data.notes,
          url: data.url,
        })
        .returningAll()
        .execute();
      const groceryItemId = result[0]!.id;
      await tx
        .insertInto("grocery_item_label")
        .values(
          labels.map((label) => ({
            grocery_item_id: groceryItemId,
            label_id: label.id,
          })),
        )
        .execute();
      return result[0];
    });
    return newGroceryItem;
  };

  static updateGroceryItem = async (
    itemId: string,
    userId: string,
    data: CreateGroceryItemInput,
  ) => {
    const store = await StoreService.getStoreByUserId(userId, data.storeId);
    if (!store) {
      throw new Error("Store not found");
    }
    const labels = await LabelService.getUserLabelsByIds(userId, data.labels);
    const updatedGroceryItem = await db.transaction().execute(async (tx) => {
      const result = await tx
        .updateTable("grocery_item")
        .set({
          name: data.itemName,
          store_id: data.storeId,
          price: data.price,
          quantity: data.quantity,
          unit: data.unit,
          notes: data.notes,
          url: data.url,
        })
        .where("id", "=", itemId)
        .where("user_id", "=", userId)
        .returningAll()
        .execute();
      if (!result.length) {
        throw new Error("Grocery item not found");
      }
      await tx
        .deleteFrom("grocery_item_label")
        .where("grocery_item_id", "=", itemId)
        .execute();
      await tx
        .insertInto("grocery_item_label")
        .values(
          labels.map((label) => ({
            grocery_item_id: itemId,
            label_id: label.id,
          })),
        )
        .execute();
      return result[0];
    });
    return updatedGroceryItem;
  };

  static deleteGroceryItem = async (itemId: string, userId: string) => {
    const result = await db.transaction().execute(async (tx) => {
      await tx
        .deleteFrom("grocery_item_label")
        .where("grocery_item_id", "=", itemId)
        .execute();

      const result = await tx
        .deleteFrom("grocery_item")
        .where("id", "=", itemId)
        .where("user_id", "=", userId)
        .returningAll()
        .execute();
      if (!result.length) {
        throw new Error("Grocery item not found");
      }
      return result[0];
    });
    return result;
  };
}
