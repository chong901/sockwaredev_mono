"use client";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";

// avoid SSR for the map component since leaflet uses window object, which cause error in SSR
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

export default function Home() {
  return <Map />;
}
