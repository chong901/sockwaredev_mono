import { Resolvers } from "@/graphql-codegen/backend/types";
import {
  getBusArrival,
  getBusRoutes,
  getBusStops,
  getNearestBusStops,
  searchBusStops,
} from "@/graphql/resolvers/BusStopResolvers";
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

  type BusArrivalData {
    BusStopCode: String!
    Services: [Service!]!
  }

  type Service {
    ServiceNo: String!
    Operator: String!
    NextBus: BusArrival
    NextBus2: BusArrival
    NextBus3: BusArrival
  }

  type BusArrival {
    OriginCode: String!
    DestinationCode: String!
    EstimatedArrival: String!
    Latitude: String!
    Longitude: String!
    VisitNumber: String!
    Load: String!
    Feature: String!
    Type: String!
  }

  type BusRoute {
    ServiceNo: String!
    Operator: String!
    Direction: Int!
    StopSequence: Int!
    BusStopCode: String!
    Distance: Float!
    WD_FirstBus: String!
    WD_LastBus: String!
    SAT_FirstBus: String!
    SAT_LastBus: String!
    SUN_FirstBus: String!
    SUN_LastBus: String!
  }

  type Query {
    getBusStops(lat: Float!, long: Float!): [BusStop!]!
    getBusArrival(code: String!): BusArrivalData!
    getNearestBusStops(lat: Float!, long: Float!): BusStop!
    searchBusStops(search: String!, offset: Int): [BusStop!]!
    getBusRoutes(serviceNo: String!, originalBusStopCode: String!): [BusRoute!]!
  }
`;

const resolvers: Resolvers = {
  Query: {
    getBusStops,
    getBusArrival: getBusArrival,
    getNearestBusStops: getNearestBusStops,
    searchBusStops: searchBusStops,
    getBusRoutes: getBusRoutes,
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(apolloServer);

export { handler as GET, handler as POST };
