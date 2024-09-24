import { LabelService } from "@/app/api/graphql/(services)/label-service";
import {
  MutationResolvers,
  QueryResolvers,
} from "@/graphql-codegen/backend/types";

export const LabelQueryResolver: Pick<QueryResolvers, "getLabels"> = {
  getLabels: async (_, __, { userId }) => {
    return LabelService.getLabels(userId);
  },
};

export const LabelMutationResolver: Pick<MutationResolvers, "addLabel"> = {
  addLabel: async (_, { name }, { userId }) => {
    return LabelService.addLabel(userId, name);
  },
};
