import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Store {
  @Field(() => ID)
  id: string;
  @Field()
  name: string;
}
