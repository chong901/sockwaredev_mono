import { StoreService } from "@/app/api/graphql/(services)/store-service";
import { UserService } from "@/app/api/graphql/(services)/user-service";
import { edgedbClient } from "@/edgedb";
import e from "@/edgedb/edgeql-js";
import { CreateGroceryItemInput } from "@/graphql-codegen/backend/types";

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
} as const;

export class GroceryItemService {
  static getGroceryItems = async (userId: string) => {
    const groceryItems = await e
      .select(e.GroceryItem, (item) => ({
        ...defaultGroceryItemReturnShape,
        filter: e.op(item.owner.id, "=", e.uuid(userId)),
        order_by: { expression: item.created_at, direction: e.DESC },
      }))
      .run(edgedbClient);
    return groceryItems;
  };

  static addGroceryItem = async (
    userId: string,
    data: CreateGroceryItemInput
  ) => {
    const currentUser = UserService.getUserQuery(userId);
    const store = StoreService.getStoreQuery(userId, data.store);
    const labels =
      data.labels.length === 0
        ? e.set()
        : e.select(e.Label, (label) => {
            const nameInCondition = e.op(
              label.name,
              "in",
              e.set(...data.labels)
            );
            const isCurrentUser = e.op(label.owner.id, "=", currentUser.id);
            return {
              filter: e.all(e.set(nameInCondition, isCurrentUser)),
            };
          });
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
        }),
        () => defaultGroceryItemReturnShape
      )
      .run(edgedbClient);
    return grocery;
  };

  static updateGroceryItem = async (
    itemId: string,
    userId: string,
    data: CreateGroceryItemInput
  ) => {
    const currentUser = UserService.getUserQuery(userId);
    const store = StoreService.getStoreQuery(userId, data.store);
    const labels =
      data.labels.length === 0
        ? e.set()
        : e.select(e.Label, (label) => {
            const nameInCondition = e.op(
              label.name,
              "in",
              e.set(...data.labels)
            );
            const isCurrentUser = e.op(label.owner.id, "=", currentUser.id);
            return {
              filter: e.all(e.set(nameInCondition, isCurrentUser)),
            };
          });
    const [grocery] = await e
      .select(
        e.update(e.GroceryItem, (item) => ({
          filter: e.all(
            e.set(
              e.op(item.id, "=", e.uuid(itemId)),
              e.op(item.owner.id, "=", currentUser.id)
            )
          ),
          set: {
            amount: data.amount,
            name: data.itemName,
            price: data.price,
            store: store,
            unit: data.unit,
            notes: data.notes,
            labels: labels,
          },
        })),
        () => defaultGroceryItemReturnShape
      )
      .run(edgedbClient);
    if (!grocery) {
      throw new Error("Grocery item not found");
    }
    return grocery;
  };

  static deleteGroceryItem = async (itemId: string, userId: string) => {
    const currentUser = UserService.getUserQuery(userId);
    const [grocery] = await e
      .select(
        e.delete(e.GroceryItem, (item) => ({
          filter: e.all(
            e.set(
              e.op(item.id, "=", e.uuid(itemId)),
              e.op(item.owner.id, "=", currentUser.id)
            )
          ),
        })),
        () => defaultGroceryItemReturnShape
      )
      .run(edgedbClient);
    if (!grocery) {
      throw new Error("Grocery item not found");
    }
    return grocery;
  };
}
