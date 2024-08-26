CREATE TABLE IF NOT EXISTS "bus_stop" (
	"bus_stop_code" text PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"latitude" numeric NOT NULL,
	"longitude" numeric NOT NULL,
	"road_name" text NOT NULL
);
