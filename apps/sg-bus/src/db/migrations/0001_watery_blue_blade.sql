CREATE TABLE IF NOT EXISTS "bus_route" (
	"service_no" text NOT NULL,
	"operator" text NOT NULL,
	"direction" integer NOT NULL,
	"stop_sequence" integer NOT NULL,
	"bus_stop_code" text NOT NULL,
	"distance" numeric NOT NULL,
	"wd_first_bus" text NOT NULL,
	"wd_last_bus" text NOT NULL,
	"sat_first_bus" text NOT NULL,
	"sat_last_bus" text NOT NULL,
	"sun_first_bus" text NOT NULL,
	"sun_last_bus" text NOT NULL
);
