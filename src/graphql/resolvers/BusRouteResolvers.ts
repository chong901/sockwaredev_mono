import { db } from "@/db/db";
import { BusRouteModel } from "@/db/schema/BusRoute";
import { BusStop, BusStopModal } from "@/db/schema/BusStop";
import {
  BusRoute,
  BusRouteResolvers,
  QueryResolvers,
} from "@/graphql-codegen/backend/types";
import DataLoader from "dataloader";
import { and, eq, inArray } from "drizzle-orm";

const busStopLoader = new DataLoader<string, BusStop>(async (codes) => {
  return db
    .select()
    .from(BusStopModal)
    .where(inArray(BusStopModal.code, codes as string[]));
});

export const busStopFieldResolver: BusRouteResolvers["BusStop"] = (parent) => {
  return busStopLoader.load(parent.BusStopCode);
};

export const getBusRoutes: QueryResolvers["getBusRoutes"] = async (
  _,
  { serviceNo, originalBusStopCode },
) => {
  const [firstStop] = await db
    .select()
    .from(BusRouteModel)
    .where(
      and(
        eq(BusRouteModel.ServiceNo, serviceNo),
        eq(BusRouteModel.BusStopCode, originalBusStopCode),
        eq(BusRouteModel.StopSequence, 1),
      ),
    );
  const result = await db
    .select()
    .from(BusRouteModel)
    .where(
      and(
        eq(BusRouteModel.ServiceNo, serviceNo),
        eq(BusRouteModel.Direction, firstStop.Direction),
      ),
    )
    .orderBy(BusRouteModel.StopSequence);
  // missing fields are in field resolver
  return result as BusRoute[];
};
