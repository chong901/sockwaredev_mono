import {
  GroceryItemMutationResolver,
  GroceryItemQueryResolver,
} from "@/app/api/graphql/(resolvers)/grocery-item-resolver";
import {
  LabelMutationResolver,
  LabelQueryResolver,
} from "@/app/api/graphql/(resolvers)/label-resolver";
import {
  StoreMutationResolver,
  StoreQueryResolver,
} from "@/app/api/graphql/(resolvers)/store-resolver";
import { nextAuth } from "@/auth";
import { Resolvers } from "@/graphql-codegen/backend/types";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import gql from "graphql-tag";
import { Session } from "next-auth";

const typeDefs = gql`
  type Label {
    id: ID!
    name: String!
  }

  type Store {
    id: ID!
    name: String!
  }

  type Query {
    getLabels: [Label!]!
    getStores: [Store!]!
    getGroceryItems: [GroceryItem!]!
  }

  type Mutation {
    addLabel(name: String!): Label!
    addStore(name: String!): Store!
    addGroceryItem(input: CreateGroceryItemInput!): GroceryItem!
    updateGroceryItem(id: ID!, input: CreateGroceryItemInput!): GroceryItem!
  }

  enum Unit {
    gram
    kilogram
    liter
    milliliter
    piece
    bag
    box
  }

  type GroceryItem {
    id: ID!
    name: String!
    store: Store!
    price: Float!
    amount: Float!
    unit: String!
    notes: String
    labels: [Label!]!
    pricePerUnit: Float!
  }

  input CreateGroceryItemInput {
    itemName: String!
    store: String!
    price: Float!
    amount: Float!
    unit: Unit!
    labels: [String!]!
    notes: String
  }
`;

const resolvers: Resolvers = {
  Query: {
    ...LabelQueryResolver,
    ...StoreQueryResolver,
    ...GroceryItemQueryResolver,
  },
  Mutation: {
    ...LabelMutationResolver,
    ...StoreMutationResolver,
    ...GroceryItemMutationResolver,
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(apolloServer, {
  context: async () => {
    // can set ENABLE_AUTH as false in local development to bypass auth (for codegen tool)
    const enabledAuth = (process.env.ENABLE_AUTH ?? "true") === "true";
    const session = (await nextAuth.auth()) as
      | (Session & { userId: string })
      | null;
    if (!session && enabledAuth) {
      throw new Error("Unauthorized");
    }
    return { userId: session?.userId };
  },
});

export { handler as GET, handler as POST };
