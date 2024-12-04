import { TimezoneService } from "@/app/api/(modules)/timezone/timezone.service";
import { GetTimezonesResponse } from "@/types/api/timezones";

export const GET = async () => {
  return Response.json({
    data: await TimezoneService.fetchTimezones(),
  } as GetTimezonesResponse);
};
