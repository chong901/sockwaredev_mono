import { useFavoriteBusStops } from "@/components/pages/map/hooks/useFavoriteBusStops";
import { BusStop } from "@/graphql-codegen/frontend/graphql";
import { FavIcon } from "@repo/ui/atoms";
import { MouseEventHandler } from "react";

type BusArrivalHeaderProps = {
  busStop: BusStop;
  onFavoriteClick?: MouseEventHandler;
};

export const BusArrivalHeader = ({
  busStop,
  onFavoriteClick,
}: BusArrivalHeaderProps) => {
  const { hasFavoriteBusStop } = useFavoriteBusStops();
  const isFavorite = hasFavoriteBusStop(busStop);
  return (
    <>
      <div className="text-3xl font-bold">{busStop.code}</div>
      <div className="overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold">
        {busStop.description}
      </div>
      <FavIcon
        onClick={onFavoriteClick}
        className={`ml-auto h-8 flex-shrink-0 ${isFavorite ? "fill-current text-yellow-500" : ""}`}
      />
    </>
  );
};
