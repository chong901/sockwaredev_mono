import { edgedbClient } from "@/edgedb";
import e from "@/edgedb/edgeql-js";
import {
  MutationResolvers,
  QueryResolvers,
} from "@/graphql-codegen/backend/types";

export const LabelQueryResolver: Pick<QueryResolvers, "getLabels"> = {
  getLabels: async (_, __, ctx) => {
    const user = await e
      .select(e.User, () => ({
        labels: () => ({ name: true, id: true }),
        filter_single: { id: ctx.userId },
      }))
      .run(edgedbClient);
    return user?.labels ?? [];
  },
};

export const LabelMutationResolver: Pick<MutationResolvers, "addLabel"> = {
  addLabel: async (_, { name }, ctx) => {
    const label = await e
      .select(
        e.insert(e.Label, {
          name,
          owner: e.select(e.User, () => ({
            filter_single: { id: ctx.userId },
          })),
        }),
        () => ({ id: true, name: true })
      )
      .run(edgedbClient);

    return label;
  },
};
