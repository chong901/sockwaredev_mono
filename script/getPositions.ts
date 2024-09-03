import polyline from "@mapbox/polyline";
import { writeFileSync } from "fs";

type Lat = number;
type Lng = number;

const main = async () => {
  const orsUrl = "http://localhost:8080/ors/v2/directions/driving-hgv";
  const latLngs: [Lat, Lng][] = []; // please fill in the latLngs to run the script
  const data = await fetch(orsUrl, {
    method: "POST",
    body: JSON.stringify({
      coordinates: latLngs.map(([lat, lng]) => [lng, lat]),
      instructions: false,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = (await data.json()) as { routes: { geometry: string }[] };
  writeFileSync(
    "temp.json",
    JSON.stringify([[...polyline.decode(json.routes[0].geometry)]]),
  );
};

main();
