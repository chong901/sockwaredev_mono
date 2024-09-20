import { edgedbClient } from "@/edgedb";
import e from "@/edgedb/edgeql-js";
import {
  MutationResolvers,
  QueryResolvers,
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
} as const;

export const GroceryItemQueryResolver: Pick<QueryResolvers, "getGroceryItems"> =
  {
    getGroceryItems: async (_, __, { userId }) => {
      const groceryItems = await e
        .select(e.GroceryItem, (item) => ({
          ...defaultGroceryItemReturnShape,
          filter: e.op(item.owner.id, "=", e.uuid(userId)),
          order_by: { expression: item.created_at, direction: e.DESC },
        }))
        .run(edgedbClient);
      return groceryItems;
    },
  };

export const GroceryItemMutationResolver: Pick<
  MutationResolvers,
  "addGroceryItem" | "updateGroceryItem" | "deleteGroceryItem"
> = {
  addGroceryItem: async (_, { input }, { userId }) => {
    const currentUser = e.select(e.User, () => ({
      filter_single: { id: userId },
    }));
    const store = e.select(e.Store, () => ({
      filter_single: { name: input.store, owner: currentUser },
    }));
    const labels =
      input.labels.length === 0
        ? e.set()
        : e.select(e.Label, (label) => {
            const nameInCondition = e.op(
              label.name,
              "in",
              e.set(...input.labels)
            );
            const isCurrentUser = e.op(label.owner.id, "=", currentUser.id);
            return {
              filter: e.all(e.set(nameInCondition, isCurrentUser)),
            };
          });
    const grocery = await e
      .select(
        e.insert(e.GroceryItem, {
          amount: input.amount,
          name: input.itemName,
          owner: currentUser,
          price: input.price,
          store: store,
          unit: input.unit,
          notes: input.notes,
          labels: labels,
        }),
        () => defaultGroceryItemReturnShape
      )
      .run(edgedbClient);
    return grocery;
  },

  updateGroceryItem: async (_, { id, input }, { userId }) => {
    const currentUser = e.select(e.User, () => ({
      filter_single: { id: userId },
    }));
    const store = e.select(e.Store, () => ({
      filter_single: { name: input.store, owner: currentUser },
    }));
    const labels =
      input.labels.length === 0
        ? e.set()
        : e.select(e.Label, (label) => {
            const nameInCondition = e.op(
              label.name,
              "in",
              e.set(...input.labels)
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
              e.op(item.id, "=", e.uuid(id)),
              e.op(item.owner.id, "=", currentUser.id)
            )
          ),
          set: {
            amount: input.amount,
            name: input.itemName,
            price: input.price,
            store: store,
            unit: input.unit,
            notes: input.notes,
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
  },

  deleteGroceryItem: async (_, { id }, { userId }) => {
    const currentUser = e.select(e.User, () => ({
      filter_single: { id: userId },
    }));
    const [grocery] = await e
      .select(
        e.delete(e.GroceryItem, (item) => ({
          filter: e.all(
            e.set(
              e.op(item.id, "=", e.uuid(id)),
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
  },
};
