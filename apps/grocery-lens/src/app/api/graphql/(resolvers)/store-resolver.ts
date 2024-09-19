import { edgedbClient } from "@/edgedb";
import e from "@/edgedb/edgeql-js";
import { QueryResolvers } from "@/graphql-codegen/backend/types";

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
