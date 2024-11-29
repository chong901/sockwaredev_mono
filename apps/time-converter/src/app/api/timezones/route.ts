import { TimezoneService } from "@/app/api/(modules)/timezone/timezone.service";
import { NextApiHandler } from "next";

export const GET: NextApiHandler = async () => {
  return Response.json({ data: await TimezoneService.fetchTimezones() });
};
