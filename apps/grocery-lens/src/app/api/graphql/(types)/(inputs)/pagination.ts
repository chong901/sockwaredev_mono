import { Field, InputType, Int } from "type-graphql";

@InputType()
export class Pagination {
  @Field(() => Int)
  limit: number;
  @Field(() => Int)
  offset: number;
}
