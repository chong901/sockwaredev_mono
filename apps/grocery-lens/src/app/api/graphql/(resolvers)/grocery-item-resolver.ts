import { GroceryItemService } from "@/app/api/graphql/(services)/grocery-item-service";
import { StoreService } from "@/app/api/graphql/(services)/store-service";
import { CreateGroceryItemInput } from "@/app/api/graphql/(types)/(inputs)/create-grocery-item";
import { GroceryItemFilter } from "@/app/api/graphql/(types)/(inputs)/grocery-item-filter";
import { GroceryItem } from "@/app/api/graphql/(types)/(objects)/grocery-item";
import { Label } from "@/app/api/graphql/(types)/(objects)/label";
import { Store } from "@/app/api/graphql/(types)/(objects)/store";
import {
  Arg,
  Ctx,
  FieldResolver,
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
    @Ctx() { userId }: { userId: string },
  ) {
    return GroceryItemService.getGroceryItems(userId, filter);
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
    @Arg("id") id: string,
    @Arg("input") input: CreateGroceryItemInput,
    @Ctx() { userId }: { userId: string },
  ) {
    return GroceryItemService.updateGroceryItem(id, userId, input);
  }

  @Mutation(() => GroceryItem)
  async deleteGroceryItem(
    @Arg("id") id: string,
    @Ctx() { userId }: { userId: string },
  ) {
    return GroceryItemService.deleteGroceryItem(id, userId);
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
