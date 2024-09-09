import { FavIcon } from "@/components/atoms/FavIcon";
import { useFavoriteBusStops } from "@/components/pages/map/hooks/useFavoriteBusStops";
import { BusStop } from "@/graphql-codegen/frontend/graphql";
import { MouseEventHandler } from "react";

type BusArrivalHeaderProps = {
  busStop: BusStop;
};

export const BusArrivalHeader = ({ busStop }: BusArrivalHeaderProps) => {
  const { addFavoriteBusStop, hasFavoriteBusStop, removeFavoriteBusStop } =
    useFavoriteBusStops();
  const handleFavoriteClick: MouseEventHandler = (e) => {
    e.stopPropagation();
    if (hasFavoriteBusStop(busStop)) {
      removeFavoriteBusStop(busStop);
    } else {
      addFavoriteBusStop(busStop);
    }
  };
  return (
    <>
      <div className="text-3xl font-bold">{busStop.code}</div>
      <div className="overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold">
        {busStop.description}
      </div>
      <FavIcon
        onClick={handleFavoriteClick}
        className={`ml-auto h-8 flex-shrink-0 ${hasFavoriteBusStop(busStop) ? "fill-current text-yellow-500" : ""}`}
      />
    </>
  );
};
