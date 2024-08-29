import { BusArrivalDataFragment } from "@/graphql-codegen/frontend/graphql";
import { divIcon } from "leaflet";
import { Marker } from "react-leaflet";

export const BusMarker = ({
  bus,
  serviceNo,
}: {
  serviceNo: string;
  bus: BusArrivalDataFragment;
}) => {
  if (!bus.Latitude || !bus.Longitude) return null;
  return (
    <Marker
      position={[parseFloat(bus.Latitude), parseFloat(bus.Longitude)]}
      icon={divIcon({
        html: `<div class="bg-slate-500 rounded-full w-fit p-2 text-xl text-slate-200">${serviceNo}</div>`,
        className: "bg-transparent",
      })}
    />
  );
};
