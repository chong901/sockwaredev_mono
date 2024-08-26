import { callLTAApi } from "@/app/api/(utils)/ltaUtil";
import { db } from "@/db/db";
import { BusStop, BusStopModal } from "@/db/schema/BusStop";

export const dynamic = "force-dynamic";

export async function GET(req: Request, res: Response) {
  try {
    const url = "https://datamall2.mytransport.sg/ltaodataservice/BusStops";
    const stops: BusStop[] = [];
    let skip = 0;
    let result = (await callLTAApi<{ value: BusStop[] }>(url)).value;
    while (result.length > 0) {
      stops.push(...result);
      skip += result.length;
      result = (await callLTAApi<{ value: BusStop[] }>(`${url}?$skip=${skip}`))
        .value;
    }
    await db.delete(BusStopModal);
    await db.insert(BusStopModal).values(stops);

    return Response.json({ message: "done" });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}
