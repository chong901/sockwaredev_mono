import { callLTAApi } from "@/app/api/(utils)/ltaUtil";
import { db } from "@/db/db";
import { BusStopModel } from "@/db/schema/BusStop";

export const dynamic = "force-dynamic";

type BusStopResponse = {
  BusStopCode: string;
  Description: string;
  Latitude: number;
  Longitude: number;
  RoadName: string;
};

export async function GET(req: Request, res: Response) {
  try {
    const url = "https://datamall2.mytransport.sg/ltaodataservice/BusStops";
    const stops: BusStopResponse[] = [];
    let skip = 0;
    let result = (await callLTAApi<{ value: BusStopResponse[] }>(url)).value;
    while (result.length > 0) {
      stops.push(...result);
      skip += result.length;
      result = (
        await callLTAApi<{ value: BusStopResponse[] }>(`${url}?$skip=${skip}`)
      ).value;
    }
    await db.delete(BusStopModel);
    await db.insert(BusStopModel).values(
      stops.map((stop) => ({
        code: stop.BusStopCode,
        description: stop.Description,
        latitude: stop.Latitude,
        longitude: stop.Longitude,
        roadName: stop.RoadName,
      })),
    );

    return Response.json({ message: "done" });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
}
