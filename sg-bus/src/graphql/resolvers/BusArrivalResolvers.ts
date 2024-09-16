import { BusArrivalResolvers } from "@/graphql-codegen/backend/types";
import { busStopLoader } from "@/graphql/loaders/busStopLoader";

export const busArrivalOriginBusStopFieldResolver: BusArrivalResolvers["originBusStop"] =
  async (parent) => {
    return busStopLoader.load(parent.OriginCode);
  };

export const busArrivalDestinationBusStopFieldResolver: BusArrivalResolvers["destinationBusStop"] =
  async (parent) => {
    return busStopLoader.load(parent.DestinationCode);
  };
