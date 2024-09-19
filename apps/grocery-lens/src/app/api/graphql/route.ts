import { LabelResolver } from "@/app/api/graphql/(resolvers)/label-resolver";
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

  type Query {
    getLabels: [Label!]!
  }
`;

const resolvers: Resolvers = {
  Query: {
    ...LabelResolver,
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
