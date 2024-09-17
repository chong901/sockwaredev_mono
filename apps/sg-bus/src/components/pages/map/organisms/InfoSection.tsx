import {
  InfoContainer,
  InfoHeader,
} from "@/components/containers/InfoContainer";
import { BusArrivalHeader } from "@/components/pages/map/molecules/BusArrivalHeader";
import { BusArrivalDetail } from "@/components/pages/map/organisms/BusArrivalDetail";
import { FavoriteBusStopList } from "@/components/pages/map/organisms/FavoriteBusStopList";
import { selectedBusServiceAtom } from "@/store/atoms/busServiceAtoms";
import { selectedBusStopAtom } from "@/store/atoms/busStopAtoms";
import { useSearchParamWithDefault } from "@repo/react-hook";
import { LoadingSpinner } from "@repo/ui/atoms";
import { useAtom } from "jotai";
import { ComponentProps } from "react";
import { useMap } from "react-leaflet";

type InfoSection = {
  onFavoriteClick: ComponentProps<typeof BusArrivalHeader>["onFavoriteClick"];
  busArrivalData: ComponentProps<typeof BusArrivalDetail>["busArrivalData"];
  isBusArrivalLoading: boolean;
  onServiceClick: ComponentProps<typeof BusArrivalDetail>["onServiceClick"];
};

export const InfoSection = ({
  onFavoriteClick,
  busArrivalData,
  isBusArrivalLoading,
  onServiceClick,
}: InfoSection) => {
  const tag = useSearchParamWithDefault("tag", "home") as "home" | "favorites";
  const [busStop] = useAtom(selectedBusStopAtom);
  const [busService] = useAtom(selectedBusServiceAtom);
  const map = useMap();
  const renderBody = () => {
    if (!busStop)
      return (
        <div className="flex flex-1 items-center justify-center p-4">
          <LoadingSpinner />
        </div>
      );
    switch (tag) {
      case "home":
        return (
          <>
            <InfoHeader
              onClick={() => map.flyTo([busStop.latitude, busStop.longitude])}
            >
              <BusArrivalHeader
                busStop={busStop}
                onFavoriteClick={onFavoriteClick}
              />
            </InfoHeader>
            <BusArrivalDetail
              key={busStop.code}
              busArrivalData={busArrivalData}
              onServiceClick={onServiceClick}
              selectedService={busService}
              isLoading={isBusArrivalLoading}
            />
          </>
        );
      case "favorites":
        return (
          <>
            <InfoHeader>
              <div className="text-3xl font-bold">Favorite</div>
            </InfoHeader>
            <FavoriteBusStopList />
          </>
        );
    }
  };

  return <InfoContainer>{renderBody()}</InfoContainer>;
};
