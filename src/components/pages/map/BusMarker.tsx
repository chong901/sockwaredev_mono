import { comingBusArrivingColor } from "@/components/pages/map/const";
import { BusArrivalDataFragment } from "@/graphql-codegen/frontend/graphql";
import { getTimeUntilArrival } from "@/utils/timeUtil";
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
  const arrivalTime = getTimeUntilArrival(bus.EstimatedArrival);
  const color = comingBusArrivingColor[bus.Load || "default"];
  return (
    <Marker
      position={[parseFloat(bus.Latitude), parseFloat(bus.Longitude)]}
      icon={divIcon({
        html: `<div class="!bg-slate-500 hover:!bg-slate-600 !rounded-full !w-12 !h-12 !flex !justify-center !items-center !text-xl text-slate-200 hover:!z-[9999] flex-col">
        <div class="${color}">
          ${arrivalTime}
        </div>
        <div class="text-xs">
          ${text}
        </div>
        </div>`,
        className:
          "!bg-slate-500 hover:!bg-slate-600 !rounded-full !w-12 !h-12 !flex !justify-center !items-center !text-xl text-slate-200 hover:!z-[9999]",
      })}
    />
  );
};
