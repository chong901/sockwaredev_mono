import { decimal, pgTable, text } from "drizzle-orm/pg-core";

export const BusStopModal = pgTable("bus_stop", {
  BusStopCode: text("bus_stop_code").primaryKey(),
  Description: text("description").notNull(),
  Latitude: decimal("latitude").notNull(),
  Longitude: decimal("longitude").notNull(),
  RoadName: text("road_name").notNull(),
});

export type BusStop = typeof BusStopModal.$inferSelect;
