import { LabelService } from "@/app/api/graphql/(services)/label-service";
import { Label } from "@/app/api/graphql/(types)/(objects)/label";
import {
  MutationResolvers,
  QueryResolvers,
} from "@/graphql-codegen/backend/types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class LabelResolver {
  @Query(() => [Label])
  async getLabels(@Ctx() { userId }: { userId: string }) {
    return LabelService.getLabels(userId);
  }

  @Mutation(() => Label)
  async addLabel(
    @Ctx() { userId }: { userId: string },
    @Arg("name") name: string,
  ) {
    return LabelService.addLabel(userId, name);
  }
}

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
