import { FavIcon } from "@/components/atoms/FavIcon";
import { BusStop } from "@/graphql-codegen/frontend/graphql";
import { MouseEventHandler } from "react";
import { useLocalStorage } from "react-use";

type BusArrivalHeaderProps = {
  busStop: BusStop;
};

export const BusArrivalHeader = ({ busStop }: BusArrivalHeaderProps) => {
  const [favoriteBusStops, setFavoriteBusStops] =
    useLocalStorage<BusStop[]>("favoriteBusStops");

  const handleFavoriteClick: MouseEventHandler<SVGSVGElement> = (e) => {
    e.stopPropagation();
    if (favoriteBusStops?.map((ele) => ele.code).includes(busStop.code)) {
      setFavoriteBusStops(
        favoriteBusStops?.filter((ele) => ele.code !== busStop.code),
      );
    } else {
      setFavoriteBusStops([...(favoriteBusStops ?? []), busStop]);
    }
  };

  const favoriteBusStopCodes = favoriteBusStops?.map((ele) => ele.code) ?? [];
  return (
    <>
      <div className="text-3xl font-bold">{busStop.code}</div>
      <div className="overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold">
        {busStop.description}
      </div>
      <FavIcon
        onClick={handleFavoriteClick}
        className={`ml-auto h-8 flex-shrink-0 ${favoriteBusStopCodes.includes(busStop.code) ? "fill-current text-yellow-500" : ""}`}
      />
    </>
  );
};
