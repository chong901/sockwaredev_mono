import { LabelService } from "@/app/api/graphql/(services)/label-service";
import { StoreService } from "@/app/api/graphql/(services)/store-service";
import { CreateGroceryItemInput } from "@/app/api/graphql/(types)/(inputs)/create-grocery-item";
import { GroceryItemFilter } from "@/app/api/graphql/(types)/(inputs)/grocery-item-filter";
import { Label } from "@/app/api/graphql/(types)/(objects)/label";
import { db } from "@/db/db";
import { edgedbClient } from "@/edgedb";
import e from "@/edgedb/edgeql-js";
import { Unit } from "@/graphql-codegen/frontend/graphql";
import DataLoader from "dataloader";
import { sql } from "kysely";

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

const defaultGroceryItemReturnShape = {
  id: true,
  name: true,
  store: { id: true, name: true },
  price: true,
  amount: true,
  unit: true,
  notes: true,
  labels: {
    id: true,
    name: true,
  },
  pricePerUnit: true,
  url: true,
} as const;

export class GroceryItemService {
  static getGroceryItems = async (
    userId: string,
    { labels, stores, keyword, limit, offset }: GroceryItemFilter,
  ) => {
    const query = db
      .selectFrom("grocery_item")
      .leftJoin("store", "grocery_item.store_id", "store.id")
      .leftJoin(
        "grocery_item_label",
        "grocery_item.id",
        "grocery_item_label.grocery_item_id",
      )
      .leftJoin("label", "grocery_item_label.label_id", "label.id")
      .selectAll("grocery_item")
      .select(sql`price / amount`.as("pricePerUnit"))
      .distinct()
      .where("grocery_item.user_id", "=", userId);
    if (labels.length) {
      query.where("label.name", "in", labels);
    }
    if (stores.length) {
      query.where("store.name", "in", stores);
    }
    if (keyword) {
      query.where("grocery_item.name", "ilike", `%${keyword}%`);
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
    const store = StoreService.getStoreQuery(userId, data.storeId);
    const labels = LabelService.getLabelsQuery(userId, data.labels);
    const [grocery] = await e
      .select(
        e.update(e.GroceryItem, (item) => ({
          filter: e.all(
            e.set(
              e.op(item.id, "=", e.uuid(itemId)),
              e.op(item.owner.id, "=", e.uuid(userId)),
            ),
          ),
          set: {
            amount: data.quantity,
            name: data.itemName,
            price: data.price,
            store: store,
            unit: data.unit as Unit,
            notes: data.notes,
            labels: labels,
            url: data.url,
          },
        })),
        () => defaultGroceryItemReturnShape,
      )
      .run(edgedbClient);
    if (!grocery) {
      throw new Error("Grocery item not found");
    }
    return grocery;
  };

  static deleteGroceryItem = async (itemId: string, userId: string) => {
    const [grocery] = await e
      .select(
        e.delete(e.GroceryItem, (item) => ({
          filter: e.all(
            e.set(
              e.op(item.id, "=", e.uuid(itemId)),
              e.op(item.owner.id, "=", e.uuid(userId)),
            ),
          ),
        })),
        () => defaultGroceryItemReturnShape,
      )
      .run(edgedbClient);
    if (!grocery) {
      throw new Error("Grocery item not found");
    }
    return grocery;
  };
}
