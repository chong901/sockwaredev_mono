import { StoreService } from "@/app/api/graphql/(services)/store-service";
import { Store } from "@/app/api/graphql/(types)/(objects)/store";
import { Arg, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root } from "type-graphql";

@Resolver(() => Store)
export class StoreResolver {
  @Query(() => [Store])
  async getStores(@Ctx() { userId }: { userId: string }) {
    return StoreService.getUserStores(userId);
  }

  @Mutation(() => Store)
  async addStore(@Ctx() { userId }: { userId: string }, @Arg("name") name: string) {
    return StoreService.addStore(userId, name);
  }

  @Mutation(() => Store)
  async updateStore(@Arg("id", () => ID) id: string, @Arg("name") name: string, @Ctx() { userId }: { userId: string }) {
    return StoreService.updateStore(userId)(id, name);
  }

  @Mutation(() => Store)
  async deleteStore(@Arg("id", () => ID) id: string, @Ctx() { userId }: { userId: string }) {
    return StoreService.deleteStore(userId)(id);
  }

  @FieldResolver(() => Number)
  async groceryItemsCount(@Root() { id }: Store) {
    return StoreService.getGroceryItemsCount(id);
  }
}
