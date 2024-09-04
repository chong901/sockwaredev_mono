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
      // + 0.0002 to move the marker a bit to the top
      position={[parseFloat(bus.Latitude) + 0.0002, parseFloat(bus.Longitude)]}
      icon={divIcon({
        html: `
        <div class="group !bg-slate-500 hover:!bg-slate-600 !rounded-full !w-12 !h-12 !flex !justify-center !items-center !text-xl text-slate-200 hover:!z-[9999] flex-col border-red-white border-2">
          <div class="${color}">
            ${arrivalTime}
          </div>
          <div class="text-xs">
            ${text}
          </div>
          <div class="absolute -bottom-1 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-8 border-t-slate-500 group-hover:border-t-slate-600"/>
        </div>`,
        className:
          "!bg-slate-500 hover:!bg-slate-600 !rounded-full !w-12 !h-12 !flex !justify-center !items-center !text-xl text-slate-200 hover:!z-[9999] !z-[999]",
      })}
    />
  );
};
