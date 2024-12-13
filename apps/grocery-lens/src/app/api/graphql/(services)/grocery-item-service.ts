import { LabelService } from "@/app/api/graphql/(services)/label-service";
import { StoreService } from "@/app/api/graphql/(services)/store-service";
import { UserService } from "@/app/api/graphql/(services)/user-service";
import { Label } from "@/app/api/graphql/(types)/(objects)/label";
import { db } from "@/db/db";
import { edgedbClient } from "@/edgedb";
import e from "@/edgedb/edgeql-js";
import {
  CreateGroceryItemInput,
  GroceryItemFilter,
  PaginationInput,
} from "@/graphql-codegen/backend/types";
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
    { labels, stores, keyword }: GroceryItemFilter,
    { limit, offset }: PaginationInput,
  ) => {
    const groceryItems = await e
      .select(e.GroceryItem, (item) => {
        const labelFilter = labels.length
          ? e.any(
              e.set(
                ...labels.map((label) => e.op(item.labels.name, "=", label)),
              ),
            )
          : e.bool(true);
        const storesFilter = stores.length
          ? e.op(item.store.name, "in", e.set(...stores))
          : e.bool(true);
        return {
          ...defaultGroceryItemReturnShape,
          filter: e.all(
            e.set(
              e.op(item.owner.id, "=", e.uuid(userId)),
              labelFilter,
              storesFilter,
              e.op(item.name, "ilike", `%${keyword}%`),
            ),
          ),
          order_by: { expression: item.created_at, direction: e.DESC },
          limit,
          offset,
        };
      })
      .run(edgedbClient);
    return groceryItems;
  };

  static getLabelsByGroceryItemId = async (groceryItemId: string) => {
    return groceryItemLabelDataloader.load(groceryItemId);
  };

  static addGroceryItem = async (
    userId: string,
    data: CreateGroceryItemInput,
  ) => {
    const currentUser = UserService.getUserQuery(userId);
    const store = StoreService.getStoreQuery(userId, data.store);
    const labels = LabelService.getLabelsQuery(userId, data.labels);
    const grocery = await e
      .select(
        e.insert(e.GroceryItem, {
          amount: data.amount,
          name: data.itemName,
          owner: currentUser,
          price: data.price,
          store: store,
          unit: data.unit,
          notes: data.notes,
          labels: labels,
          url: data.url,
        }),
        () => defaultGroceryItemReturnShape,
      )
      .run(edgedbClient);
    return grocery;
  };

  static updateGroceryItem = async (
    itemId: string,
    userId: string,
    data: CreateGroceryItemInput,
  ) => {
    const store = StoreService.getStoreQuery(userId, data.store);
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
            amount: data.amount,
            name: data.itemName,
            price: data.price,
            store: store,
            unit: data.unit,
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
