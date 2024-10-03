import { GroceryItemService } from "@/app/api/graphql/(services)/grocery-item-service";
import {
  MutationResolvers,
  QueryResolvers,
} from "@/graphql-codegen/backend/types";

export const GroceryItemQueryResolver: Pick<QueryResolvers, "getGroceryItems"> =
  {
    getGroceryItems: async (_, { filter, pagination }, { userId }) => {
      return GroceryItemService.getGroceryItems(userId, filter, pagination);
    },
  };

export const GroceryItemMutationResolver: Pick<
  MutationResolvers,
  "addGroceryItem" | "updateGroceryItem" | "deleteGroceryItem"
> = {
  addGroceryItem: async (_, { input }, { userId }) => {
    return GroceryItemService.addGroceryItem(userId, input);
  },

  updateGroceryItem: async (_, { id, input }, { userId }) => {
    return GroceryItemService.updateGroceryItem(id, userId, input);
  },

  deleteGroceryItem: async (_, { id }, { userId }) => {
    return GroceryItemService.deleteGroceryItem(id, userId);
  },
};
