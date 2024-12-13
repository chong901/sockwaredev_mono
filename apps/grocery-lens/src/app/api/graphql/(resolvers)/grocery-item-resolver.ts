import { GroceryItemService } from "@/app/api/graphql/(services)/grocery-item-service";
import { StoreService } from "@/app/api/graphql/(services)/store-service";
import { CreateGroceryItemInput } from "@/app/api/graphql/(types)/(inputs)/create-grocery-item";
import { GroceryItemFilter } from "@/app/api/graphql/(types)/(inputs)/grocery-item-filter";
import { Pagination } from "@/app/api/graphql/(types)/(inputs)/pagination";
import { GroceryItem } from "@/app/api/graphql/(types)/(objects)/grocery-item";
import { Label } from "@/app/api/graphql/(types)/(objects)/label";
import { Store } from "@/app/api/graphql/(types)/(objects)/store";
import {
  Arg,
  Ctx,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

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

  @Mutation(() => GroceryItem)
  async addGroceryItem(
    @Arg("input") input: CreateGroceryItemInput,
    @Ctx() { userId }: { userId: string },
  ) {
    return GroceryItemService.addGroceryItem(userId, input);
  }

  @Mutation(() => GroceryItem)
  async updateGroceryItem(
    @Arg("id", () => ID) id: string,
    @Arg("input") input: CreateGroceryItemInput,
    @Ctx() { userId }: { userId: string },
  ) {
    return GroceryItemService.updateGroceryItem(id, userId, input);
  }

  @Mutation(() => GroceryItem)
  async deleteGroceryItem(
    @Arg("id", () => ID) id: string,
    @Ctx() { userId }: { userId: string },
  ) {
    return GroceryItemService.deleteGroceryItem(id, userId);
  }

  @FieldResolver(() => Store)
  async store(@Root() { store_id }: GroceryItem) {
    return StoreService.getStoreById(store_id);
  }

  @FieldResolver(() => [Label])
  labels(@Root() { id }: GroceryItem) {
    return GroceryItemService.getLabelsByGroceryItemId(id);
  }
}
