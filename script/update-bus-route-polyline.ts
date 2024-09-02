import "./env-loader";
// import env loader first

import { db } from "@/db/db";
import { BusRouteModel } from "@/db/schema/BusRoute";
import {
  BusRoutePolyline,
  BusRoutePolylineModel,
} from "@/db/schema/BusRoutePolyline";
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
  tags?: {
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
  const count: Record<string, number> = {};

  osmData.elements.forEach((ele) => {
    if (
      ele.type === "relation" &&
      ele.tags?.["ref"] &&
      serviceNumbers.includes(ele.tags?.["ref"])
    ) {
      const updatedRelation = updateRelation(ele);
      busRoutes.push(processRelation(updatedRelation, ways, nodes));
      const key = `${updatedRelation.tags?.["ref"]}-${updatedRelation.tags?.["direction"]}`;
      count[key] = (count[key] || 0) + 1;
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
