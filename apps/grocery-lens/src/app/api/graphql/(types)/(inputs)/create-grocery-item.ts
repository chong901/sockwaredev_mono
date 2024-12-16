import { Field, InputType } from "type-graphql";

@InputType("CreateGroceryItemInput")
export class CreateGroceryItemInput {
  @Field()
  itemName: string;
  @Field()
  storeId: string;
  @Field()
  price: number;
  @Field()
  quantity: number;
  @Field()
  unit: string;
  @Field(() => [String])
  labels: string[];
  @Field({ nullable: true })
  notes?: string;
  @Field({ nullable: true })
  url?: string;
}
