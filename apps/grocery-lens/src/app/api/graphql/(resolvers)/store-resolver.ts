import { StoreService } from "@/app/api/graphql/(services)/store-service";
import {
  MutationResolvers,
  QueryResolvers,
} from "@/graphql-codegen/backend/types";

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
