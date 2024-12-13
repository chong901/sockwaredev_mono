import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class Label {
  @Field(() => ID)
  id: string;
  @Field()
  name: string;
}
