import { InfoContainer } from "@/components/containers/InfoContainer";
import { BusArrivalHeader } from "@/components/pages/map/molecules/BusArrivalHeader";
import { BusArrivalDetail } from "@/components/pages/map/organisms/BusArrivalDetail";
import { FavoriteBusStopList } from "@/components/pages/map/organisms/FavoriteBusStopList";
import { useSearchParamWithDefault } from "@/hooks/useSearchParamWithDefault";
import { selectedBusServiceAtom } from "@/store/atoms/busServiceAtoms";
import { selectedBusStopAtom } from "@/store/atoms/busStopAtoms";
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
  const renderHeader = () => {
    switch (tag) {
      case "home":
        return (
          <BusArrivalHeader
            busStop={busStop!}
            onFavoriteClick={onFavoriteClick}
          />
        );
      case "favorites":
        return <div className="text-3xl font-bold">Favorite </div>;
    }
  };
  const renderBody = () => {
    switch (tag) {
      case "home":
        return (
          <BusArrivalDetail
            key={busStop!.code}
            busArrivalData={busArrivalData}
            onServiceClick={onServiceClick}
            selectedService={busService}
            isLoading={isBusArrivalLoading}
          />
        );
      case "favorites":
        return <FavoriteBusStopList />;
    }
  };

  const handleHeaderClick = () => {
    if (!busStop) return;
    switch (tag) {
      case "home":
        return map.flyTo([busStop.latitude, busStop.longitude]);
      case "favorites":
        return;
    }
  };

  if (!busStop) return null;

  return (
    <InfoContainer header={renderHeader()} onHeaderClick={handleHeaderClick}>
      {renderBody()}
    </InfoContainer>
  );
};
