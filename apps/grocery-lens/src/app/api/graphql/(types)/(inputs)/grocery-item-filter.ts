import { Field, InputType } from "type-graphql";

@InputType()
export class GroceryItemFilter {
  @Field(() => [String])
  stores: string[];
  @Field(() => [String])
  labels: string[];
  @Field()
  keyword: string;
}
