import { SortBy } from "@/enums/sort-by";
import { Field, InputType, registerEnumType } from "type-graphql";

registerEnumType(SortBy, { name: "GroceryItemSortBy" });

@InputType("GroceryItemFilter")
export class GroceryItemFilter {
  @Field(() => [String])
  stores: string[];
  @Field(() => [String])
  labels: string[];
  @Field()
  keyword: string;
  @Field(() => SortBy)
  sortBy: SortBy;
}
