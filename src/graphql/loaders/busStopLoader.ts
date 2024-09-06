import { db } from "@/db/db";
import { BusStopModel } from "@/db/schema/BusStop";
import { BusStop } from "@/graphql-codegen/backend/types";
import DataLoader from "dataloader";
import { inArray } from "drizzle-orm";

export const busStopLoader = new DataLoader<string, BusStop>(async (codes) => {
  const result = await db
    .select()
    .from(BusStopModel)
    .where(inArray(BusStopModel.code, codes as string[]));
  return codes.map((code) => result.find((r) => r.code === code)!);
});
