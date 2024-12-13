import { StoreService } from "@/app/api/graphql/(services)/store-service";
import { Store } from "@/app/api/graphql/(types)/(objects)/store";
import {
  MutationResolvers,
  QueryResolvers,
} from "@/graphql-codegen/backend/types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class StoreResolver {
  @Query(() => [Store])
  async getStores(@Ctx() { userId }: { userId: string }) {
    return StoreService.getStores(userId);
  }

  @Mutation(() => Store)
  async addStore(
    @Ctx() { userId }: { userId: string },
    @Arg("name") name: string,
  ) {
    return StoreService.addStore(userId, name);
  }
}

export const StoreQueryResolver: Pick<QueryResolvers, "getStores"> = {
  getStores: async (_, __, { userId }) => {
    return StoreService.getStores(userId);
  },
};

export const StoreMutationResolver: Pick<MutationResolvers, "addStore"> = {
  addStore: async (_, { name }, { userId }) => {
    return StoreService.addStore(userId, name);
  },
};
