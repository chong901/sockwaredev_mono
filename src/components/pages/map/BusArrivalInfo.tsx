import { LoadingSpinner } from "@/components/atoms/LoadingSpinner";
import { comingBusArrivingColor } from "@/components/pages/map/const";
import {
  BusStop,
  GetBusArrivalQuery,
} from "@/graphql-codegen/frontend/graphql";
import { useAvoidMapScroll } from "@/hooks/useAvoidMapScroll";
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

export const BusArrivalInfo = ({
  busStop,
  busArrivalData,
  onServiceClick,
  onBusStopClick,
  selectedService,
  isLoading,
}: BusArrivalInfoProps) => {
  const listContainerRef = useRef<HTMLDivElement>(null);

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

  useAvoidMapScroll(listContainerRef);

  return (
    <div
      className="absolute bottom-0 left-1/2 z-[1000] flex h-1/3 w-full -translate-x-1/2 flex-col rounded-lg bg-gradient-to-l from-blue-50 via-blue-100 to-blue-200 shadow-md lg:bottom-[unset] lg:left-[unset] lg:right-8 lg:top-20 lg:h-[unset] lg:max-h-[67%] lg:min-w-[320px] lg:max-w-[400px] lg:translate-x-[unset]"
      ref={listContainerRef}
    >
      <div
        className="flex flex-wrap items-end gap-2 p-4"
        onClick={() => onBusStopClick?.(busStop)}
      >
        <div className="text-3xl font-bold">{busStop.code}</div>
        <div className="text-xl font-bold">{busStop.description}</div>
      </div>
      <hr className="border-t-2 border-gray-200" />
      {isLoading && isSameBusStop ? (
        <div className="flex w-full justify-center p-4">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-2 overflow-scroll py-4">
          <div className="flex w-full px-4">
            <div className="text-sm">Bus No</div>
            <div className="ml-auto text-sm">Arriving in (mins)</div>
          </div>
          {busArrivalData?.Services.map((service, index, arr) => {
            const nextBuses = [
              service.NextBus,
              service.NextBus2,
              service.NextBus3,
            ];

            return (
              <Fragment key={service.ServiceNo}>
                <div
                  className={`flex cursor-pointer px-4 hover:font-bold ${selectedService?.ServiceNo === service.ServiceNo ? "font-bold" : ""}`}
                  onClick={() => onServiceClick?.(service)}
                >
                  <div className="text-2xl">{service.ServiceNo}</div>
                  <div className="ml-auto flex items-baseline gap-2">
                    {/* 
                      used when the bus stop is the same and the interval fetching is triggered
                    */}
                    {isLoading ? (
                      <LoadingSpinner className="h-8 w-8" />
                    ) : (
                      nextBuses.map((bus, index) => (
                        <div
                          className={`text-right ${comingBusArrivingColor[bus?.Load ?? "default"]} ${
                            index === 0 ? `text-2xl` : "w-4 text-base"
                          }`}
                          key={`${service.ServiceNo}-${index}`}
                        >
                          {getTimeUntilArrival(bus?.EstimatedArrival)}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                {index !== arr.length - 1 && (
                  <hr className="w-full border-t border-slate-300" />
                )}
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};
