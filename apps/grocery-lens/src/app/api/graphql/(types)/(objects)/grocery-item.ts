import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class GroceryItem {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  price: number;

  @Field()
  quantity: number;

  @Field()
  unit: string;

  @Field({ nullable: true })
  notes: string;

  @Field()
  pricePerUnit: number;

  @Field({ nullable: true })
  url: string;

  storeId: string;
}
