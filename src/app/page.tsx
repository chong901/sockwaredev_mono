import "leaflet/dist/leaflet.css";
import { Metadata } from "next";
import dynamic from "next/dynamic";

// avoid SSR for the map component since leaflet uses window object, which cause error in SSR
const Map = dynamic(() => import("@/components/pages/map/MapPage"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Real-Time Singapore Bus Arrival Timings | Find Your Next Bus Easily",
  description:
    "Quickly find real-time bus arrival timings in Singapore. Stay updated with the next bus arrival at your stop. Reliable and easy-to-use Singapore bus timing service.",
};

export default function Home() {
  return <Map />;
}
