import { callLTAApi } from "@/app/api/(utils)/ltaUtil";
import { db } from "@/db/db";
import { BusStopModel } from "@/db/schema/BusStop";
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
    .from(BusStopModel)
    .where(
      and(
        gte(BusStopModel.latitude, lat - nearByLatLngDelta),
        lte(BusStopModel.latitude, lat + nearByLatLngDelta),
        gte(BusStopModel.longitude, long - nearByLatLngDelta),
        lte(BusStopModel.longitude, long + nearByLatLngDelta),
      ),
    );
  return result;
};

export const getBusArrival: QueryResolvers["getBusArrival"] = async (
  _,
  { code },
) => {
  const result = await callLTAApi<BusArrivalData>(
    `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${code}`,
  );
  return result;
};

export const getNearestBusStops: QueryResolvers["getNearestBusStops"] = async (
  _,
  { lat, long },
) => {
  const result = await db
    .select({
      ...getTableColumns(BusStopModel),
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
    .from(BusStopModel)
    .orderBy(sql`distance`)
    .limit(1);
  return result[0]!;
};

export const searchBusStops: QueryResolvers["searchBusStops"] = async (
  _,
  { search, offset },
) => {
  const searchKeyword = `%${search.toLowerCase()}%`;
  const result = await db
    .select()
    .from(BusStopModel)
    .where(
      sql`lower(description) LIKE ${searchKeyword} or lower(code) LIKE ${searchKeyword}`,
    )
    .orderBy(BusStopModel.code)
    .limit(100)
    .offset(offset ?? 0);
  return result;
};
