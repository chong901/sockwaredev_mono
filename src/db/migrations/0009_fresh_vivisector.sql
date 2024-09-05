ALTER TABLE "bus_route" ALTER COLUMN "sat_first_bus" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "bus_route" ALTER COLUMN "sat_last_bus" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "bus_route" ALTER COLUMN "sun_first_bus" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "bus_route" ALTER COLUMN "sun_last_bus" DROP NOT NULL;