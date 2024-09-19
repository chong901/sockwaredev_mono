import { edgedbClient } from "@/edgedb";
import e from "@/edgedb/edgeql-js";
import { QueryResolvers } from "@/graphql-codegen/backend/types";

export const LabelResolver: QueryResolvers = {
  getLabels: async (_, __, ctx) => {
    const user = await e
      .select(e.User, () => ({
        labels: () => ({ name: true }),
        filter_single: { id: ctx.userId },
      }))
      .run(edgedbClient);
    return user?.labels ?? [];
  },
};
