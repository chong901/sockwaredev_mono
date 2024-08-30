import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";

export const BusRoutePolylineModel = pgTable(
  "bus_route_polyline",
  {
    serviceNo: text("service_no").notNull(),
    originCode: text("origin_code").notNull(),
    encodedPolyline: text("encoded_polyline").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.serviceNo, table.originCode] }),
  }),
);

export type BusRoutePolyline = typeof BusRoutePolylineModel.$inferSelect;
