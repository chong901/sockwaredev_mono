CREATE TABLE IF NOT EXISTS "bus_route_polyline" (
	"service_no" text NOT NULL,
	"origin_code" text NOT NULL,
	"encoded_polyline" text NOT NULL,
	CONSTRAINT "bus_route_polyline_service_no_origin_code_pk" PRIMARY KEY("service_no","origin_code")
);
