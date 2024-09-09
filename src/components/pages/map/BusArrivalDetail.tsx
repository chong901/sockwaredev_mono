import { LoadingSpinner } from "@/components/atoms/LoadingSpinner";
import { comingBusArrivingColor } from "@/components/pages/map/const";
import { useAvoidMapScroll } from "@/components/pages/map/hooks/useAvoidMapScroll";
import {
  BusStop,
  GetBusArrivalQuery,
} from "@/graphql-codegen/frontend/graphql";
import { getTimeUntilArrival } from "@/utils/timeUtil";
import { Fragment, useEffect, useRef, useState } from "react";

type BusArrivalInfoProps = {
  busStop: BusStop;
  busArrivalData?: GetBusArrivalQuery["getBusArrival"];
  selectedService?: GetBusArrivalQuery["getBusArrival"]["Services"][number];
  onServiceClick?: (
    service: GetBusArrivalQuery["getBusArrival"]["Services"][number],
  ) => void;
  onBusStopClick?: (busStop: BusStop) => void;
  isLoading: boolean;
};

export const BusArrivalDetail = ({
  busStop,
  busArrivalData,
  onServiceClick,
  onBusStopClick,
  selectedService,
  isLoading,
}: BusArrivalInfoProps) => {
  const listRef = useRef<HTMLDivElement>(null);

  // This state is used to prevent the component from re-rendering when the bus stop is the same
  //  with interval refetching, the component will re-render every time the interval is triggered
  //  to avoid the loading spinner for the list to be shown every time, we will set this state to false
  const [isSameBusStop, setIsSameBusStop] = useState(true);

  useEffect(() => {
    if (!isSameBusStop) return;
    if (!isLoading && isSameBusStop) {
      setIsSameBusStop(false);
    }
  }, [isSameBusStop, isLoading]);

  useAvoidMapScroll(listRef);

  return (
    <div
      className="flex flex-1 flex-col gap-2 overflow-scroll py-4"
      ref={listRef}
    >
      {isLoading && isSameBusStop ? (
        <div className="flex w-full justify-center p-4">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="flex w-full px-4">
            <div className="text-sm">Bus No</div>
            <div className="ml-auto text-sm">Arriving in (mins)</div>
          </div>
          {busArrivalData?.Services.map((service, index, arr) => {
            return (
              <Fragment key={service.ServiceNo}>
                <BusServiceDetail
                  service={service}
                  onServiceClick={onServiceClick}
                  isSelected={selectedService?.ServiceNo === service.ServiceNo}
                  isLoading={isLoading}
                />
                {index !== arr.length - 1 && (
                  <hr className="w-full border-t border-slate-300" />
                )}
              </Fragment>
            );
          })}
        </>
      )}
    </div>
  );
};

type BusServiceDetailProps = {
  service: GetBusArrivalQuery["getBusArrival"]["Services"][number];
  onServiceClick?: (
    service: GetBusArrivalQuery["getBusArrival"]["Services"][number],
  ) => void;
  isLoading: boolean;
  isSelected: boolean;
};

function BusServiceDetail({
  service,
  isLoading,
  onServiceClick,
  isSelected,
}: BusServiceDetailProps) {
  const nextBuses = [service.NextBus, service.NextBus2, service.NextBus3];
  const hasFromToInformation =
    service.NextBus?.originBusStop && service.NextBus?.destinationBusStop;
  const fromToInformation = `${service.NextBus?.originBusStop?.description} -> ${service.NextBus?.destinationBusStop?.description}`;

  return (
    <div
      className={`flex cursor-pointer gap-2 px-4 hover:font-bold ${isSelected ? "font-bold" : ""}`}
      onClick={() => onServiceClick?.(service)}
    >
      <div className="w-2/12 text-2xl">{service.ServiceNo}</div>
      <div className="flex w-7/12 items-center text-xs">
        {hasFromToInformation && fromToInformation}
      </div>
      <div className="flex w-3/12 items-baseline justify-end gap-2">
        {/* 
       used when the bus stop is the same and the interval fetching is triggered
      */}
        {isLoading ? (
          <LoadingSpinner className="m-auto h-8 w-8" />
        ) : (
          nextBuses.map((bus, index) => (
            <div
              className={`text-right ${comingBusArrivingColor[bus?.Load ?? "default"]} ${index === 0 ? `text-2xl` : "w-4 text-base"}`}
              key={`${service.ServiceNo}-${index}`}
            >
              {getTimeUntilArrival(bus?.EstimatedArrival)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
