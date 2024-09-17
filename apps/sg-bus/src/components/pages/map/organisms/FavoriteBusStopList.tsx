import { useAvoidMapScroll } from "@/components/pages/map/hooks/useAvoidMapScroll";
import { useFavoriteBusStops } from "@/components/pages/map/hooks/useFavoriteBusStops";
import { selectedBusStopAtom } from "@/store/atoms/busStopAtoms";
import { DeleteButton } from "@repo/ui/atoms";
import { ItemList } from "@repo/ui/organisms";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRef } from "react";
import { useMap } from "react-leaflet";

export const FavoriteBusStopList = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const { favoriteBusStops, removeFavoriteBusStop } = useFavoriteBusStops();
  const [_, setSelectedBusStop] = useAtom(selectedBusStopAtom);
  const map = useMap();
  useAvoidMapScroll(listRef);
  return (
    <div className="flex flex-1 flex-col overflow-scroll py-2" ref={listRef}>
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
            className="flex cursor-pointer items-end gap-4 px-4 py-2 !text-slate-700 hover:font-bold"
          >
            <div className="text-2xl">{favoriteBusStop.name}</div>
            <div className="ml-auto text-xs">
              {favoriteBusStop.busStop.code}
            </div>
            <DeleteButton
              className="h-6 w-6 p-1"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                removeFavoriteBusStop(favoriteBusStop.busStop);
              }}
            />
          </Link>
        )}
        getKey={(favoriteBusStop) => favoriteBusStop.busStop.code}
      />
    </div>
  );
};
