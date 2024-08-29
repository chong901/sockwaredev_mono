import { BusArrivalDataFragment } from "@/graphql-codegen/frontend/graphql";
import { divIcon } from "leaflet";
import { Marker } from "react-leaflet";

export const BusMarker = ({
  bus,
  text,
}: {
  text: string;
  bus: BusArrivalDataFragment;
}) => {
  if (!bus.Latitude || !bus.Longitude) return null;
  return (
    <Marker
      position={[parseFloat(bus.Latitude), parseFloat(bus.Longitude)]}
      icon={divIcon({
        html: text,
        className:
          "!bg-slate-500 hover:!bg-slate-600 !rounded-full !w-12 !h-12 !flex !justify-center !items-center !text-xl !text-slate-200 hover:!z-[9999]",
      })}
    />
  );
};
