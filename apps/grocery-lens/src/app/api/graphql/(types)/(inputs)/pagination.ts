import { Field, InputType, Int } from "type-graphql";

@InputType("Pagination")
export class Pagination {
  @Field(() => Int)
  limit: number;
  @Field(() => Int)
  offset: number;
}
