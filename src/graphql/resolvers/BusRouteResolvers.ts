import { db } from "@/db/db";
import { BusRouteModel } from "@/db/schema/BusRoute";
import { BusRoutePolylineModel } from "@/db/schema/BusRoutePolyline";
import {
  BusRouteResolvers,
  QueryResolvers,
} from "@/graphql-codegen/backend/types";
import { busStopLoader } from "@/graphql/loaders/busStopLoader";
import { and, eq } from "drizzle-orm";

export const busStopFieldResolver: BusRouteResolvers["BusStop"] = (parent) => {
  return busStopLoader.load(parent.BusStopCode);
};

export const getBusRoutes: QueryResolvers["getBusRoutes"] = async (
  _,
  { serviceNo, originBusStopCode },
) => {
  const [firstStop] = await db
    .select()
    .from(BusRouteModel)
    .where(
      and(
        eq(BusRouteModel.ServiceNo, serviceNo),
        eq(BusRouteModel.BusStopCode, originBusStopCode),
        eq(BusRouteModel.StopSequence, 1),
      ),
    );
  const result = await db
    .select()
    .from(BusRoutePolylineModel)
    .where(
      and(
        eq(BusRoutePolylineModel.serviceNo, serviceNo),
        eq(BusRoutePolylineModel.direction, firstStop.Direction),
      ),
    )
    .limit(1);
  return result[0].polylines as number[][][];
};
