import { InfoContainer } from "@/components/containers/InfoContainer";
import { BusArrivalDetail } from "@/components/pages/map/BusArrivalDetail";
import { BusArrivalHeader } from "@/components/pages/map/BusArrivalHeader";
import { BusStop } from "@/graphql-codegen/frontend/graphql";
import { ComponentProps } from "react";
import { useMap } from "react-leaflet";

type BusArrivalInfoProps = ComponentProps<typeof BusArrivalDetail> & {
  busStop: BusStop;
};

export const BusArrivalInfo = ({
  busStop,
  isLoading,
  busArrivalData,
  onServiceClick,
  selectedService,
}: BusArrivalInfoProps) => {
  const map = useMap();
  return (
    <InfoContainer
      header={<BusArrivalHeader busStop={busStop} />}
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
