import { db } from "@/db/db";
import { BusRouteModel } from "@/db/schema/BusRoute";
import { BusRoutePolylineModel } from "@/db/schema/BusRoutePolyline";
import { BusStop, BusStopModel } from "@/db/schema/BusStop";
import {
  BusRouteResolvers,
  QueryResolvers,
} from "@/graphql-codegen/backend/types";
import DataLoader from "dataloader";
import { and, eq, inArray } from "drizzle-orm";

const busStopLoader = new DataLoader<string, BusStop>(async (codes) => {
  const result = await db
    .select()
    .from(BusStopModel)
    .where(inArray(BusStopModel.code, codes as string[]));
  return codes.map((code) => result.find((r) => r.code === code)!);
});

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
