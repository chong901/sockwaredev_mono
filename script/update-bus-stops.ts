import "./env-loader";
// import env loader first

import { callLTAApi } from "@/app/api/(utils)/ltaUtil";
import { db } from "@/db/db";
import { BusStop, BusStopModel } from "@/db/schema/BusStop";
import { eq } from "drizzle-orm";

interface OverpassElement {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags?: {
    ref: string;
    [key: string]: string;
  };
}

interface OverpassResponse {
  elements: OverpassElement[];
}

// Function to fetch bus stops from Overpass API using fetch
async function fetchBusStops(): Promise<Required<OverpassElement>[]> {
  const overpassUrl = "https://overpass-api.de/api/interpreter";

  const overpassQuery = `
      [out:json];
      area[name="Singapore"]->.searchArea;
      node["highway"="bus_stop"](area.searchArea);
      out body;
      >;
      out skel qt;
  `;

  try {
    // Fetching data using fetch API
    const response = await fetch(overpassUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    // Parse the response JSON
    const data: OverpassResponse = await response.json();

    // Return the list of bus stops
    return data.elements.filter(
      (ele): ele is Required<OverpassElement> => !!ele.tags?.ref,
    );
  } catch (error) {
    console.error("Error fetching data from Overpass API:", error);
    throw new Error("Failed to fetch bus stops");
  }
}

type BusStopResponseFromLTA = {
  BusStopCode: string;
  Description: string;
  Latitude: number;
  Longitude: number;
  RoadName: string;
};

const main = async () => {
  await db.transaction(async (tx) => {
    const url = "https://datamall2.mytransport.sg/ltaodataservice/BusStops";
    const stops: BusStopResponseFromLTA[] = [];
    let skip = 0;
    let result = (await callLTAApi<{ value: BusStopResponseFromLTA[] }>(url))
      .value;
    while (result.length > 0) {
      stops.push(...result);
      skip += result.length;
      result = (
        await callLTAApi<{ value: BusStopResponseFromLTA[] }>(
          `${url}?$skip=${skip}`,
        )
      ).value;
    }
    await tx.delete(BusStopModel);
    await tx.insert(BusStopModel).values(
      stops.map((stop) => ({
        code: stop.BusStopCode,
        description: stop.Description,
        latitude: stop.Latitude,
        longitude: stop.Longitude,
        roadName: stop.RoadName,
      })),
    );
    const overpassBusStops = await fetchBusStops();
    const mappedOsmBusStops = overpassBusStops.map<
      Pick<BusStop, "code" | "latitude" | "longitude">
    >((busStop) => ({
      code: busStop.tags.ref,
      latitude: busStop.lat,
      longitude: busStop.lon,
    }));
    for (const busStop of mappedOsmBusStops) {
      await tx
        .update(BusStopModel)
        .set({ latitude: busStop.latitude, longitude: busStop.longitude })
        .where(eq(BusStopModel.code, busStop.code));
    }
  });
  console.log("Bus stops updated");
  process.exit(0);
};

main();
