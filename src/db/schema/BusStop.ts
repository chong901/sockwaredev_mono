import { doublePrecision, pgTable, text } from "drizzle-orm/pg-core";

export const BusStopModal = pgTable("bus_stop", {
  code: text("code").primaryKey(),
  description: text("description").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  roadName: text("road_name").notNull(),
});

export type BusStop = typeof BusStopModal.$inferSelect;
