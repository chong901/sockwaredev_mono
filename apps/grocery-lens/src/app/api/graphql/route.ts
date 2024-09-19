import { nextAuth } from "@/auth";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import gql from "graphql-tag";
import { Session } from "next-auth";

const typeDefs = gql`
  type Query {
    hello: String!
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(apolloServer, {
  context: async () => {
    const session = (await nextAuth.auth()) as Session & { userId: string };
    if (!session) {
      throw new Error("Unauthorized");
    }
    return { userId: session.userId };
  },
});

export { handler as GET, handler as POST };
