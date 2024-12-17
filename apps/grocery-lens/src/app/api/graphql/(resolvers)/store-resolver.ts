import { StoreService } from "@/app/api/graphql/(services)/store-service";
import { Store } from "@/app/api/graphql/(types)/(objects)/store";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class StoreResolver {
  @Query(() => [Store])
  async getStores(@Ctx() { userId }: { userId: string }) {
    return StoreService.getUserStores(userId);
  }

  @Mutation(() => Store)
  async addStore(@Ctx() { userId }: { userId: string }, @Arg("name") name: string) {
    return StoreService.addStore(userId, name);
  }
}
