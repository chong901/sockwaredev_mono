import { callLTAApi } from "@/app/api/(utils)/ltaUtil";
import { db } from "@/db/db";
import { BusStopModal } from "@/db/schema/BusStop";
import {
  BusArrivalData,
  QueryResolvers,
} from "@/graphql-codegen/backend/types";
import { and, getTableColumns, gte, lte, sql } from "drizzle-orm";

export const getBusStops: QueryResolvers["getBusStops"] = async (
  _,
  { lat, long },
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
        lte(BusStopModal.longitude, long + nearByLatLngDelta),
      ),
    );
  return result;
};

export const getBusArrival: QueryResolvers["getBusArrival"] = async (
  _,
  { code },
) => {
  const result = await callLTAApi<BusArrivalData>(
    `https://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${code}`,
  );
  return result;
};

export const getNearestBusStops: QueryResolvers["getNearestBusStops"] = async (
  _,
  { lat, long },
) => {
  const result = await db
    .select({
      ...getTableColumns(BusStopModal),
      distance: sql`
    (
      6371 * acos(
        cos(radians(${lat})) * cos(radians(latitude)) *
        cos(radians(longitude) - radians(${long})) +
        sin(radians(${lat})) * sin(radians(latitude))
      )
    ) AS distance
    `,
    })
    .from(BusStopModal)
    .orderBy(sql`distance`)
    .limit(1);
  return result[0];
};

export const searchBusStops: QueryResolvers["searchBusStops"] = async (
  _,
  { search, offset },
) => {
  const searchKeyword = `%${search.toLowerCase()}%`;
  const result = await db
    .select()
    .from(BusStopModal)
    .where(
      sql`lower(description) LIKE ${searchKeyword} or lower(code) LIKE ${searchKeyword}`,
    )
    .orderBy(BusStopModal.code)
    .limit(100)
    .offset(offset ?? 0);
  return result;
};
