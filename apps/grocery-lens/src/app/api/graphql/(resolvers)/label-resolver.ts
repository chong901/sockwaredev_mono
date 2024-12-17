import { LabelService } from "@/app/api/graphql/(services)/label-service";
import { Label } from "@/app/api/graphql/(types)/(objects)/label";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class LabelResolver {
  @Query(() => [Label])
  async getLabels(@Ctx() { userId }: { userId: string }) {
    return LabelService.getUserLabels(userId);
  }

  @Mutation(() => Label)
  async addLabel(@Ctx() { userId }: { userId: string }, @Arg("name") name: string) {
    return LabelService.addLabel(userId, name);
  }
}
