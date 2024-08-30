DO $$ BEGIN
 ALTER TABLE "bus_route" ADD CONSTRAINT "bus_route_bus_stop_code_bus_stop_code_fk" FOREIGN KEY ("bus_stop_code") REFERENCES "public"."bus_stop"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
