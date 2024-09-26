import { LabelService } from "@/app/api/graphql/(services)/label-service";
import { StoreService } from "@/app/api/graphql/(services)/store-service";
import { UserService } from "@/app/api/graphql/(services)/user-service";
import { edgedbClient } from "@/edgedb";
import e from "@/edgedb/edgeql-js";
import {
  CreateGroceryItemInput,
  GroceryItemFilter,
} from "@/graphql-codegen/backend/types";

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
        };
      })
      .run(edgedbClient);
    return groceryItems;
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
