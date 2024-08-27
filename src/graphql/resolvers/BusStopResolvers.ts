import { db } from "@/db/db";
import { BusStopModal } from "@/db/schema/BusStop";
import { QueryResolvers } from "@/graphql/types";
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
