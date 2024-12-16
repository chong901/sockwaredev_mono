import { Field, ID, ObjectType } from "type-graphql";

@ObjectType("Store")
export class Store {
  @Field(() => ID)
  id: string;
  @Field()
  name: string;
}
