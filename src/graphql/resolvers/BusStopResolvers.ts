import { callLTAApi } from "@/app/api/(utils)/ltaUtil";
import { db } from "@/db/db";
import { BusStopModal } from "@/db/schema/BusStop";
import {
  BusArrivalData,
  QueryResolvers,
} from "@/graphql-codegen/backend/types";
import { and, gte, lte } from "drizzle-orm";

export const getBusStops: QueryResolvers["getBusStops"] = async (
  _,
  { lat, long }
) => {
  const nearByLatLngDelta = 0.01;
  const result = await db
    .select()
    .from(BusStopModal)
    .where(
      and(
        gte(BusStopModal.latitude, lat - nearByLatLngDelta),
        lte(BusStopModal.latitude, lat + nearByLatLngDelta),
        gte(BusStopModal.longitude, long - nearByLatLngDelta),
        lte(BusStopModal.longitude, long + nearByLatLngDelta)
      )
    );
  return result;
};

export const getBusArrival: QueryResolvers["getBusArrival"] = async (
  _,
  { code }
) => {
  const result = await callLTAApi<BusArrivalData>(
    `https://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${code}`
  );
  return result;
};
