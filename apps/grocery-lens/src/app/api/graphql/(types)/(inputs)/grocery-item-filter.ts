import { Pagination } from "@/app/api/graphql/(types)/(inputs)/pagination";
import { Field, InputType } from "type-graphql";

@InputType()
export class GroceryItemFilter extends Pagination {
  @Field(() => [String])
  stores: string[];
  @Field(() => [String])
  labels: string[];
  @Field()
  keyword: string;
}
