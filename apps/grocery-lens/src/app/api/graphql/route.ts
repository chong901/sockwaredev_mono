import "reflect-metadata";

import { GroceryItemResolver } from "@/app/api/graphql/(resolvers)/grocery-item-resolver";
import { LabelResolver } from "@/app/api/graphql/(resolvers)/label-resolver";
import { StoreResolver } from "@/app/api/graphql/(resolvers)/store-resolver";
import { nextAuth } from "@/auth";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { Session } from "next-auth";

import { buildSchema } from "type-graphql";

const schema = await buildSchema({
  resolvers: [GroceryItemResolver, StoreResolver, LabelResolver],
});

const apolloServer = new ApolloServer({
  // typeDefs,
  // resolvers,
  schema,
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
