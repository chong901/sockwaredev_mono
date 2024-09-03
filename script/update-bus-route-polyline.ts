import { BusRouteModel } from "@/db/schema/BusRoute";
import "./env-loader";
// import env loader first

import { db } from "@/db/db";
import {
  BusRoutePolyline,
  BusRoutePolylineModel,
} from "@/db/schema/BusRoutePolyline";
import { BusStop, BusStopModal } from "@/db/schema/BusStop";
import polyline from "@mapbox/polyline";
import { and, eq, ExtractTablesWithRelations, sql } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";
import { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const main = async () => {
  await db.transaction(async (tx) => {
    await tx.delete(BusRoutePolylineModel);
    const serviceNumbers = await tx
      .selectDistinct({ serviceNo: BusRouteModel.ServiceNo })
      .from(BusRouteModel);
    const busRoutePolylines = await processBusRoutes(
      serviceNumbers.map((x) => x.serviceNo),
    );
    await tx.insert(BusRoutePolylineModel).values(busRoutePolylines);
    const missingBusRoutePolylines = await fetchMissingRoutePositions(tx);
    await tx.insert(BusRoutePolylineModel).values(missingBusRoutePolylines);
  });

  console.log("Bus route polyline updated");
  process.exit(0);
};

main();

type OSMElementNode = {
  type: "node";
  id: number;
  lat: number;
  lon: number;
};

type OSMElementWay = {
  type: "way";
  id: number;
  nodes: number[];
};

type OSMRelation = {
  type: "relation";
  id: number;
  tags: {
    [key: string]: string;
  };
  ref?: number;
  nodes?: number[];
  lat?: number;
  lon?: number;
  members?: OSMMember[];
};

type OSMElement = OSMRelation | OSMElementNode | OSMElementWay;

type OSMMember = {
  type: "node" | "way";
  ref: number;
  role: string;
};

interface OSMResponse {
  elements: OSMElement[];
}

async function processBusRoutes(
  serviceNumbers: string[],
): Promise<BusRoutePolyline[]> {
  const osmData = await fetchBusRoutes();
  const nodes: Record<number, OSMElementNode> = {};
  const ways: Record<number, OSMElementWay> = {};
  const busRoutes: BusRoutePolyline[] = [];
  osmData.elements.forEach((ele) => {
    switch (ele.type) {
      case "node":
        nodes[ele.id] = ele;
        break;
      case "way":
        ways[ele.id] = ele;
        break;
    }
  });

  osmData.elements.forEach((ele) => {
    if (
      ele.type === "relation" &&
      ele.tags?.["ref"] &&
      serviceNumbers.includes(ele.tags?.["ref"])
    ) {
      const updatedRelation = updateRelation(ele);
      busRoutes.push(processRelation(updatedRelation, ways, nodes));
    }
  });

  return busRoutes;
}

async function fetchBusRoutes(): Promise<OSMResponse> {
  const cachedData = readCachedData();
  if (cachedData) return cachedData;
  const overpassUrl = "https://overpass-api.de/api/interpreter";
  const overpassQuery = `
          [out:json];
          area[name="Singapore"]->.searchArea;
          relation["type"="route"]["route"="bus"](area.searchArea);
          out body;
          >;
          out skel qt;
      `;

  const response = await fetch(overpassUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `data=${encodeURIComponent(overpassQuery)}`,
  });

  if (!response.ok) {
    throw new Error(`Error fetching bus routes: ${response.statusText}`);
  }

  const data: OSMResponse = await response.json();

  writeFileSync(cachedFilePath, JSON.stringify(data, null, 2));

  return data;
}

const cachedFilePath = path.join(__dirname, "overpass-bus-routes.json");

const readCachedData = () => {
  try {
    const data = readFileSync(cachedFilePath, "utf-8");
    if (!data) return null;
    return JSON.parse(data) as OSMResponse;
  } catch (error) {
    return null;
  }
};

// it's used when the direction is undefined
const missingOverpassBusDirection: Record<string, string> = {
  "992": "2",
  "2B": "1",
  "5A": "1",
  "5B": "1",
  "856B": "1",
  "102A": "1",
  "410G": "1",
  "163B": "1",
  "230": "1",
  "102B": "1",
  "18": "2",
  "856A": "1",
};

const updateRelation = (relation: OSMRelation) => {
  if (relation.tags?.ref === "870") {
    const from = relation.tags?.from;
    return {
      ...relation,
      tags: {
        ...relation.tags,
        direction: from === "Tengah Interchange" ? "2" : "1",
      },
    };
  }
  if (relation.tags && !relation.tags?.direction) {
    relation.tags.direction =
      missingOverpassBusDirection[relation.tags?.ref!] ?? "-1";
  }

  // it's used when the direction value is wrong
  if (["410G", "84W", "86B", "168A"].includes(relation.tags?.ref!)) {
    relation.tags.direction = "1";
  }
  return relation;
};

const processRelation = (
  element: OSMRelation,
  ways: Record<number, OSMElementWay>,
  nodes: Record<number, OSMElementNode>,
) => {
  const serviceNo = element.tags?.["ref"] || "Unknown";
  const direction = parseInt(element.tags?.["direction"] ?? "-1");
  const polylines: [number, number][][] = [];
  element.members?.forEach((member) => {
    if (member.type === "node") return;
    const way = ways[member.ref];
    polylines.push(
      way.nodes.map((nodeId) => [nodes[nodeId].lat, nodes[nodeId].lon]),
    );
  });

  return {
    serviceNo,
    direction,
    polylines,
  };
};

const overwriteBusStops: Record<
  string,
  Pick<BusStop, "latitude" | "longitude">
> = {
  // to fix 102A that bus stops are not in the correct position cause the polyline to be wrong
  "67389": {
    latitude: 1.3943077,
    longitude: 103.8887821,
  },
  "67549": {
    latitude: 1.3946449,
    longitude: 103.8864269,
  },

  // to fix 84A that bus stops are not in the correct position cause the polyline to be wrong
  "65009": {
    latitude: 1.4035212,
    longitude: 103.9030817,
  },
  "65221": {
    latitude: 1.4039774,
    longitude: 103.9048174,
  },

  "91079": {
    latitude: 1.3013564,
    longitude: 103.8952756,
  },
  "80219": {
    latitude: 1.3068379,
    longitude: 103.8755128,
  },

  // to fix 871 that polyline route is wrong
  "43801": {
    latitude: 1.354316,
    longitude: 103.7517342,
  },
};

const fetchMissingRoutePositions = async (
  tx: PgTransaction<
    PostgresJsQueryResultHKT,
    Record<string, never>,
    ExtractTablesWithRelations<Record<string, never>>
  >,
) => {
  const missingRoutes = await tx.execute<{
    service_no: string;
    direction: number;
  }>(sql`
    select
      bus_route.service_no,
      bus_route.direction
    from bus_route
    left join bus_route_polyline on bus_route_polyline.service_no = bus_route.service_no and bus_route_polyline.direction = bus_route.direction
    where bus_route_polyline.service_no is null
    group by bus_route.service_no, bus_route.direction
    `);

  console.log("missingRoutes:", missingRoutes);

  const busRoutePolylines: BusRoutePolyline[] = await Promise.all(
    missingRoutes.map(async (missingRoute) => {
      const overridePolylines = getOverrideBusRoutes(
        missingRoute.service_no,
        missingRoute.direction,
      );
      if (overridePolylines) {
        return {
          direction: missingRoute.direction,
          serviceNo: missingRoute.service_no,
          polylines: overridePolylines,
        };
      }
      const data = await tx
        .select()
        .from(BusRouteModel)
        .leftJoin(
          BusStopModal,
          eq(BusRouteModel.BusStopCode, BusStopModal.code),
        )
        .where(
          and(
            eq(BusRouteModel.ServiceNo, missingRoute.service_no),
            eq(BusRouteModel.Direction, missingRoute.direction),
          ),
        )
        .orderBy(BusRouteModel.StopSequence);
      const updatedData = data.map((ele) => {
        const busStopCode = ele.bus_stop?.code;
        const overwriteBusStopData = overwriteBusStops[busStopCode!];
        if (overwriteBusStopData) {
          return {
            ...ele,
            bus_stop: {
              ...ele.bus_stop,
              ...overwriteBusStopData,
            },
          };
        }
        return ele;
      });
      const polylinePosition = await fetchPolylinePositionsFromORS(
        updatedData.map((ele) => ele.bus_stop as BusStop),
      );
      return {
        serviceNo: missingRoute.service_no,
        direction: missingRoute.direction,
        polylines: [polylinePosition],
      };
    }),
  );
  return busRoutePolylines;
};

const fetchPolylinePositionsFromORS = async (busStops: BusStop[]) => {
  const orsUrl = "http://localhost:8080/ors/v2/directions/driving-hgv";
  const data = await fetch(orsUrl, {
    method: "POST",
    body: JSON.stringify({
      coordinates: busStops.map((ele) => [ele.longitude, ele.latitude]),
      instructions: false,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = (await data.json()) as { routes: { geometry: string }[] };
  return polyline.decode(json.routes[0].geometry);
};

const getOverrideBusRoutes = (serviceNo: string, direction: number) => {
  try {
    const data = readFileSync(
      path.join(
        __dirname,
        "override_bus_routes",
        `${serviceNo}-${direction}.json`,
      ),
      "utf-8",
    );
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};
