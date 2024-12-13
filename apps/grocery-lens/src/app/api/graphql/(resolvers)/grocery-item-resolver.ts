import { GroceryItemService } from "@/app/api/graphql/(services)/grocery-item-service";
import { StoreService } from "@/app/api/graphql/(services)/store-service";
import { GroceryItemFilter } from "@/app/api/graphql/(types)/(args)/grocery-item-filter";
import { Pagination } from "@/app/api/graphql/(types)/(args)/pagination";
import { GroceryItem } from "@/app/api/graphql/(types)/(objects)/grocery-item";
import { Label } from "@/app/api/graphql/(types)/(objects)/label";
import { Store } from "@/app/api/graphql/(types)/(objects)/store";
import {
  MutationResolvers,
  QueryResolvers,
} from "@/graphql-codegen/backend/types";
import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql";

@Resolver(() => GroceryItem)
export class GroceryItemResolver {
  @Query(() => [GroceryItem])
  async getGroceryItems(
    @Arg("filter") filter: GroceryItemFilter,
    @Arg("pagination") pagination: Pagination,
    @Ctx() { userId }: { userId: string },
  ) {
    return GroceryItemService.getGroceryItems(userId, filter, pagination);
  }

  @FieldResolver(() => Store)
  async store(@Root() { storeId }: GroceryItem) {
    return StoreService.getStoreById(storeId);
  }

  @FieldResolver(() => [Label])
  labels(@Root() { id }: GroceryItem) {
    return GroceryItemService.getLabelsByGroceryItemId(id);
  }
}

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
