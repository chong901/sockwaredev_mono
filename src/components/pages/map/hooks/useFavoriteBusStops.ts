import { BusStop } from "@/graphql-codegen/backend/types";
import { useLocalStorage } from "react-use";

export const useFavoriteBusStops = () => {
  const [favoriteBusStops, setFavoriteBusStops] =
    useLocalStorage<BusStop[]>("favoriteBusStops");

  const addFavoriteBusStop = (busStop: BusStop) => {
    setFavoriteBusStops([...(favoriteBusStops ?? []), busStop]);
  };

  const removeFavoriteBusStop = (busStop: BusStop) => {
    setFavoriteBusStops(
      favoriteBusStops?.filter((ele) => ele.code !== busStop.code),
    );
  };

  const hasFavoriteBusStop = (busStop: BusStop) => {
    return favoriteBusStops?.map((ele) => ele.code).includes(busStop.code);
  };

  return {
    favoriteBusStops,
    addFavoriteBusStop,
    removeFavoriteBusStop,
    hasFavoriteBusStop,
  };
};
