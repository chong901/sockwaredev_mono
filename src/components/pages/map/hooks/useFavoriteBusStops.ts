import { BusStop } from "@/graphql-codegen/backend/types";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type FavoriteBusStop = {
  name: string;
  busStop: BusStop;
};

const favoriteBusStopAtom = atomWithStorage<FavoriteBusStop[]>(
  "favoriteBusStops",
  [],
);

export const useFavoriteBusStops = () => {
  const [favoriteBusStops, setFavoriteBusStops] = useAtom(favoriteBusStopAtom);

  const addFavoriteBusStop = (busStop: FavoriteBusStop) => {
    setFavoriteBusStops([...(favoriteBusStops ?? []), busStop]);
  };

  const removeFavoriteBusStop = (busStop: BusStop) => {
    setFavoriteBusStops(
      favoriteBusStops?.filter((ele) => ele.busStop.code !== busStop.code),
    );
  };

  const hasFavoriteBusStop = (busStop: BusStop) => {
    return favoriteBusStops
      ?.map((ele) => ele.busStop.code)
      .includes(busStop.code);
  };

  return {
    favoriteBusStops,
    addFavoriteBusStop,
    removeFavoriteBusStop,
    hasFavoriteBusStop,
  };
};
