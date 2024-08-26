import { callLTAApi } from "@/app/api/(utils)/ltaUtil";
import { db } from "@/db/db";
import { BusRoute, BusRouteModel } from "@/db/schema/BusRoute";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = "https://datamall2.mytransport.sg/ltaodataservice/BusRoutes";
  let response = await callLTAApi<{ value: BusRoute[] }>(url);
  let skip = 0;
  await db.delete(BusRouteModel);
  while (response.value.length > 0) {
    await db.insert(BusRouteModel).values(response.value);
    skip += response.value.length;
    response = await callLTAApi<{ value: BusRoute[] }>(`${url}?$skip=${skip}`);
  }
  return Response.json({ message: "done" });
}
