import { doublePrecision, integer, pgTable, text } from "drizzle-orm/pg-core";

export const BusRouteModel = pgTable("bus_route", {
  ServiceNo: text("service_no").notNull(),
  Operator: text("operator").notNull(),
  Direction: integer("direction").notNull(),
  StopSequence: integer("stop_sequence").notNull(),
  BusStopCode: text("bus_stop_code").notNull(),
  Distance: doublePrecision("distance").notNull(),
  WD_FirstBus: text("wd_first_bus").notNull(),
  WD_LastBus: text("wd_last_bus").notNull(),
  SAT_FirstBus: text("sat_first_bus").notNull(),
  SAT_LastBus: text("sat_last_bus").notNull(),
  SUN_FirstBus: text("sun_first_bus").notNull(),
  SUN_LastBus: text("sun_last_bus").notNull(),
});

export type BusRoute = typeof BusRouteModel.$inferSelect;
