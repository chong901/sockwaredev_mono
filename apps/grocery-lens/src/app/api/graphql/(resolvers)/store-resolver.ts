import { UserService } from "@/app/api/graphql/(services)/user-service";
import { edgedbClient } from "@/edgedb";
import e from "@/edgedb/edgeql-js";
import {
  MutationResolvers,
  QueryResolvers,
} from "@/graphql-codegen/backend/types";

export const StoreQueryResolver: Pick<QueryResolvers, "getStores"> = {
  getStores: async (_, __, ctx) => {
    const user = await e
      .select(e.User, () => ({
        stores: () => ({
          id: true,
          name: true,
        }),
        filter_single: { id: ctx.userId },
      }))
      .run(edgedbClient);
    return user?.stores ?? [];
  },
};

export const StoreMutationResolver: Pick<MutationResolvers, "addStore"> = {
  addStore: async (_, { name }, ctx) => {
    const currentUser = UserService.getUserQuery(ctx.userId);
    const newStore = await e
      .select(
        e.insert(e.Store, {
          name,
          owner: currentUser,
        }),
        () => ({
          id: true,
          name: true,
        })
      )
      .run(edgedbClient);
    return newStore;
  },
};
