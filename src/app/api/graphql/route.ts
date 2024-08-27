import { Resolvers } from "@/graphql-codegen/backend/types";
import { getBusStops } from "@/graphql/resolvers/BusStopResolvers";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import gql from "graphql-tag";

const typeDefs = gql`
  type BusStop {
    code: ID!
    description: String!
    latitude: Float!
    longitude: Float!
    roadName: String!
  }
  type Query {
    getBusStops(lat: Float!, long: Float!): [BusStop!]!
  }
`;

const resolvers: Resolvers = {
  Query: {
    getBusStops,
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(apolloServer);

export { handler as GET, handler as POST };
