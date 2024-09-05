import "leaflet/dist/leaflet.css";
import { Metadata } from "next";
import dynamic from "next/dynamic";

// avoid SSR for the map component since leaflet uses window object, which cause error in SSR
const Map = dynamic(() => import("@/components/pages/map/MapPage"), {
  ssr: false,
});

const APP_NAME = "SG Bus Arrival Timing";
const APP_DEFAULT_TITLE =
  "Real-Time Singapore Bus Arrival Timings | Find Your Next Bus Easily";
const APP_TITLE_TEMPLATE = "%s - SG Bus Arrival";
const APP_DESCRIPTION =
  "Quickly find real-time bus arrival timings in Singapore. Stay updated with the next bus arrival at your stop. Reliable and easy-to-use Singapore bus timing service.";

export const metadata: Metadata = {
  // PWA configurations
  applicationName: APP_NAME,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title:
      "Real-Time Singapore Bus Arrival Timings | Find Your Next Bus Easily",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },

  title: "Real-Time Singapore Bus Arrival Timings | Find Your Next Bus Easily",
  description:
    "Quickly find real-time bus arrival timings in Singapore. Stay updated with the next bus arrival at your stop. Reliable and easy-to-use Singapore bus timing service.",
};

export default function Home() {
  return (
    <>
      <h1 className="absolute text-transparent">
        Find Singapore Bus Arrival Timings in Real-Time
      </h1>
      <Map />
    </>
  );
}
