import { edgedbClient } from "@/edgedb";
import e from "@/edgedb/edgeql-js";
import {
  MutationResolvers,
  QueryResolvers,
} from "@/graphql-codegen/backend/types";

export const GroceryItemQueryResolver: Pick<QueryResolvers, "getGroceryItems"> =
  {
    getGroceryItems: async (_, __, { userId }) => {
      const groceryItems = await e
        .select(e.GroceryItem, (item) => ({
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
          filter: e.op(item.owner.id, "=", e.uuid(userId)),
        }))
        .run(edgedbClient);
      return groceryItems;
    },
  };

export const GroceryItemMutationResolver: Pick<
  MutationResolvers,
  "addGroceryItem"
> = {
  addGroceryItem: async (_, { input }, { userId }) => {
    const currentUser = e.select(e.User, () => ({
      filter_single: { id: userId },
    }));
    const store = e.select(e.Store, () => ({
      filter_single: { name: input.store, owner: currentUser },
    }));
    const labels = e.select(e.Label, (label) => {
      const nameInCondition = e.op(label.name, "in", e.set(...input.labels));
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
        () => ({
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
        })
      )
      .run(edgedbClient);
    return grocery;
  },
};
