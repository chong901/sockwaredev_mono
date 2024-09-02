import { integer, jsonb, pgTable, primaryKey, text } from "drizzle-orm/pg-core";

export const BusRoutePolylineModel = pgTable(
  "bus_route_polyline",
  {
    serviceNo: text("service_no").notNull(),
    direction: integer("direction").notNull(),

    // store [number, number][][] as jsonb
    // [lat, lng][] is a polyline, a bus route is composed with multiple polylines
    polylines: jsonb("polylines").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.serviceNo, table.direction] }),
  }),
);

export type BusRoutePolyline = typeof BusRoutePolylineModel.$inferSelect;
