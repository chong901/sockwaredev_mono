import { BusStop } from "@/graphql-codegen/backend/types";
import { useLocalStorage } from "react-use";

type FavoriteBusStop = {
  name: string;
  busStop: BusStop;
};

export const useFavoriteBusStops = () => {
  const [favoriteBusStops, setFavoriteBusStops] =
    useLocalStorage<FavoriteBusStop[]>("favoriteBusStops");

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
