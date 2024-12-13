import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class GroceryItemFilter {
  @Field()
  stores: string[];
  @Field()
  labels: string[];
  @Field()
  keyword: string;
}
