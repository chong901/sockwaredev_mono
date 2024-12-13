import { ArgsType, Field, Int } from "type-graphql";

@ArgsType()
export class Pagination {
  @Field(() => Int)
  limit: number;
  @Field(() => Int)
  offset: number;
}
