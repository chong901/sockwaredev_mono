ALTER TABLE "bus_route_polyline" DROP CONSTRAINT "bus_route_polyline_service_no_origin_code_pk";--> statement-breakpoint
ALTER TABLE "bus_route_polyline" ADD COLUMN "direction" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "bus_route_polyline" ADD CONSTRAINT "bus_route_polyline_service_no_direction_pk" PRIMARY KEY("service_no","direction");--> statement-breakpoint
ALTER TABLE "bus_route_polyline" ADD COLUMN "polylines" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "bus_route_polyline" DROP COLUMN IF EXISTS "origin_code";--> statement-breakpoint
ALTER TABLE "bus_route_polyline" DROP COLUMN IF EXISTS "encoded_polyline";