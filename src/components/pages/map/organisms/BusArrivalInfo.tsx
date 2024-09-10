import { InfoContainer } from "@/components/containers/InfoContainer";
import { BusArrivalHeader } from "@/components/pages/map/molecules/BusArrivalHeader";
import { BusArrivalDetail } from "@/components/pages/map/organisms/BusArrivalDetail";
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
}: BusArrivalInfoProps) => {
  const map = useMap();
  return (
    <InfoContainer
      header={
        <BusArrivalHeader busStop={busStop} onFavoriteClick={onFavoriteClick} />
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
