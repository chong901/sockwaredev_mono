import { Field, ID, ObjectType } from "type-graphql";

@ObjectType("Label")
export class Label {
  @Field(() => ID)
  id: string;
  @Field()
  name: string;
}
