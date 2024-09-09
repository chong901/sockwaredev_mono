import { ItemList } from "@/components/organisms/ItemList";
import { useAvoidMapScroll } from "@/components/pages/map/hooks/useAvoidMapScroll";
import { useFavoriteBusStops } from "@/components/pages/map/hooks/useFavoriteBusStops";
import { useRef } from "react";

export const FavoriteList = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const { favoriteBusStops } = useFavoriteBusStops();

  useAvoidMapScroll(listRef);
  return (
    <div
      className="flex flex-1 flex-col gap-2 overflow-scroll py-4"
      ref={listRef}
    >
      <ItemList
        data={favoriteBusStops ?? []}
        renderItem={(busStop, index, arr) => (
          <div className="flex cursor-pointer items-center gap-2 px-4 hover:font-bold">
            <div className="text-2xl">{busStop.code}</div>
            <div className="text-xs">{busStop.description}</div>
          </div>
        )}
        uniqIdentifier="code"
      />
    </div>
  );
};
