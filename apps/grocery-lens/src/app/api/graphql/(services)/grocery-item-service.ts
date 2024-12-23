import { LabelService } from "@/app/api/graphql/(services)/label-service";
import { StoreService } from "@/app/api/graphql/(services)/store-service";
import { UrlService } from "@/app/api/graphql/(services)/url-service";
import { CreateGroceryItemInput } from "@/app/api/graphql/(types)/(inputs)/create-grocery-item";
import { GroceryItemFilter } from "@/app/api/graphql/(types)/(inputs)/grocery-item-filter";
import { Pagination } from "@/app/api/graphql/(types)/(inputs)/pagination";
import { Label } from "@/app/api/graphql/(types)/(objects)/label";
import { db } from "@/db/db";
import { DB } from "@/db/types";
import { SortBy } from "@/enums/sort-by";
import DataLoader from "dataloader";
import { InsertObject, Kysely, sql, UpdateObject } from "kysely";

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
  { cache: false },
);

export class GroceryItemService {
  static getGroceryItems = async (userId: string, { labels, stores, keyword, sortBy }: GroceryItemFilter, { limit, offset }: Pagination) => {
    let query = db
      .selectFrom("grocery_item")
      .leftJoin("store", "grocery_item.store_id", "store.id")
      .leftJoin("grocery_item_label", "grocery_item.id", "grocery_item_label.grocery_item_id")
      .leftJoin("label", "grocery_item_label.label_id", "label.id")
      .selectAll("grocery_item")
      .distinct()
      .where("grocery_item.user_id", "=", userId)
      .$if(!!labels.length, (qb) => qb.where("label.name", "in", labels))
      .$if(!!stores.length, (qb) => qb.where("store.name", "in", stores))
      .$if(!!keyword, (qb) => qb.where("grocery_item.name", "ilike", `%${keyword}%`));

    switch (sortBy) {
      case SortBy.NAME:
        query = query.orderBy("grocery_item.name", "asc");
        break;
      case SortBy.RECENCY:
        query = query.orderBy("grocery_item.created_at", "desc");
        break;
      case SortBy.LOWEST_PRICE:
        query = query.orderBy("grocery_item.price", "asc");
        break;
      case SortBy.HIGHEST_PRICE:
        query = query.orderBy("grocery_item.price", "desc");
        break;
      case SortBy.LOWEST_PRICE_PER_UNIT:
        query = query.select(sql`grocery_item.price / grocery_item.quantity`.as("price_per_unit")).orderBy(sql`grocery_item.price / grocery_item.quantity`, "asc");
        break;
      case SortBy.HIGHEST_PRICE_PER_UNIT:
        query = query.select(sql`grocery_item.price / grocery_item.quantity`.as("price_per_unit")).orderBy(sql`grocery_item.price / grocery_item.quantity`, "desc");
        break;
      default:
        query = query.orderBy("grocery_item.created_at", "desc");
    }
    const data = await query.limit(limit).offset(offset).execute();
    return data;
  };

  static getLabelsByGroceryItemId = async (groceryItemId: string) => {
    return groceryItemLabelDataloader.load(groceryItemId);
  };

  static addGroceryItem = async (userId: string, data: CreateGroceryItemInput) => {
    const store = await StoreService.getStoreByUserId(userId, data.storeId);
    if (!store) {
      throw new Error("Store not found");
    }
    const value: InsertObject<DB, "grocery_item"> = {
      name: data.itemName,
      user_id: userId,
      store_id: data.storeId,
      price: data.price,
      quantity: data.quantity,
      unit: data.unit,
      notes: data.notes,
      url: data.url,
    };
    if (data.url) {
      const previewUrl = await UrlService.fetchUrlPreview(data.url);
      value.url_preview_image = previewUrl.image;
    }
    const labels = await LabelService.getUserLabelsByIds(userId, data.labels);
    const newGroceryItem = await db.transaction().execute(async (tx) => {
      const groceryItem = await tx.insertInto("grocery_item").values(value).returningAll().executeTakeFirstOrThrow();
      await this.addGroceryItemLabel(groceryItem.id, labels, tx);
      return groceryItem;
    });
    return newGroceryItem;
  };

  static updateGroceryItem = async (itemId: string, userId: string, data: CreateGroceryItemInput) => {
    const store = await StoreService.getStoreByUserId(userId, data.storeId);
    const dbGroceryItem = await db.selectFrom("grocery_item").where("id", "=", itemId).where("user_id", "=", userId).selectAll().executeTakeFirst();
    if (!dbGroceryItem) {
      throw new Error("Grocery item not found");
    }
    if (!store) {
      throw new Error("Store not found");
    }
    const value: UpdateObject<DB, "grocery_item"> = {
      name: data.itemName,
      store_id: data.storeId,
      price: data.price,
      quantity: data.quantity,
      unit: data.unit,
      notes: data.notes,
      url: data.url,
    };
    if (!data.url) {
      value.url_preview_image = null;
    } else if (data.url !== dbGroceryItem.url) {
      const previewUrl = await UrlService.fetchUrlPreview(data.url);
      value.url_preview_image = previewUrl.image;
    }
    const labels = await LabelService.getUserLabelsByIds(userId, data.labels);
    const updatedGroceryItem = await db.transaction().execute(async (tx) => {
      const result = await tx.updateTable("grocery_item").set(value).where("id", "=", itemId).where("user_id", "=", userId).returningAll().execute();
      if (!result.length) {
        throw new Error("Grocery item not found");
      }
      await tx.deleteFrom("grocery_item_label").where("grocery_item_id", "=", itemId).execute();
      await this.addGroceryItemLabel(itemId, labels, tx);
      return result[0];
    });
    return updatedGroceryItem;
  };

  static deleteGroceryItem = async (itemId: string, userId: string) => {
    const result = await db.transaction().execute(async (tx) => {
      await tx.deleteFrom("grocery_item_label").where("grocery_item_id", "=", itemId).execute();

      const result = await tx.deleteFrom("grocery_item").where("id", "=", itemId).where("user_id", "=", userId).returningAll().execute();
      if (!result.length) {
        throw new Error("Grocery item not found");
      }
      return result[0];
    });
    return result;
  };

  private static addGroceryItemLabel = async (groceryItemId: string, labels: Label[], tx: Kysely<DB>) => {
    if (labels.length === 0) return [];
    return tx
      .insertInto("grocery_item_label")
      .values(
        labels.map((label) => ({
          grocery_item_id: groceryItemId,
          label_id: label.id,
        })),
      )
      .returningAll()
      .execute();
  };
}
