import { ItemList } from "@/components/organisms/ItemList";
import { useAvoidMapScroll } from "@/components/pages/map/hooks/useAvoidMapScroll";
import { useFavoriteBusStops } from "@/components/pages/map/hooks/useFavoriteBusStops";
import { selectedBusStopAtom } from "@/store/atoms/busStopAtoms";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRef } from "react";
import { useMap } from "react-leaflet";

export const FavoriteBusStopList = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const { favoriteBusStops } = useFavoriteBusStops();
  const [_, setSelectedBusStop] = useAtom(selectedBusStopAtom);
  const map = useMap();
  useAvoidMapScroll(listRef);
  return (
    <div
      className="flex flex-1 flex-col gap-2 overflow-scroll py-4"
      ref={listRef}
    >
      <ItemList
        data={favoriteBusStops ?? []}
        renderItem={(favoriteBusStop) => (
          <Link
            href={{
              query: {
                tag: "home",
              },
            }}
            onClick={() => {
              setSelectedBusStop(favoriteBusStop.busStop);
              map.flyTo([
                favoriteBusStop.busStop.latitude,
                favoriteBusStop.busStop.longitude,
              ]);
            }}
            className="flex cursor-pointer items-end gap-2 px-4 !text-slate-700 hover:font-bold"
          >
            <div className="text-2xl">{favoriteBusStop.name}</div>
            <div className="ml-auto text-xs">
              {favoriteBusStop.busStop.code}
            </div>
          </Link>
        )}
        getKey={(favoriteBusStop) => favoriteBusStop.busStop.code}
      />
    </div>
  );
};
