import { Field, InputType } from "type-graphql";

@InputType()
export class CreateGroceryItemInput {
  @Field()
  itemName: string;
  @Field()
  storeId: string;
  @Field()
  price: number;
  @Field()
  amount: number;
  @Field()
  unit: string;
  @Field()
  labels: string[];
  @Field({ nullable: true })
  notes?: string;
  @Field({ nullable: true })
  url?: string;
}
