import { Field, ID, ObjectType } from "type-graphql";

@ObjectType("GroceryItem")
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

  @Field({ nullable: true })
  url: string;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  url_preview_image?: string;

  store_id: string;
}
