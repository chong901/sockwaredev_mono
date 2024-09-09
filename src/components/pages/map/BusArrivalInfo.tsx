import { InfoContainer } from "@/components/containers/InfoContainer";
import { BusArrivalDetail } from "@/components/pages/map/BusArrivalDetail";
import { BusArrivalHeader } from "@/components/pages/map/BusArrivalHeader";
import { ComponentProps } from "react";
import { useMap } from "react-leaflet";

type BusArrivalInfoProps = ComponentProps<typeof BusArrivalDetail> &
  ComponentProps<typeof BusArrivalHeader>;

export const BusArrivalInfo = ({
  busStop,
  isLoading,
  busArrivalData,
  onServiceClick,
  selectedService,
  onFavoriteClick,
  isFavorite,
}: BusArrivalInfoProps) => {
  const map = useMap();
  return (
    <InfoContainer
      header={
        <BusArrivalHeader
          busStop={busStop}
          onFavoriteClick={onFavoriteClick}
          isFavorite={isFavorite}
        />
      }
      onHeaderClick={() => map.flyTo([busStop.latitude, busStop.longitude])}
    >
      <BusArrivalDetail
        key={busStop.code}
        busArrivalData={busArrivalData}
        onServiceClick={onServiceClick}
        selectedService={selectedService}
        isLoading={isLoading}
      />
    </InfoContainer>
  );
};
