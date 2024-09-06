import { LoadingSpinner } from "@/components/atoms/LoadingSpinner";
import { comingBusArrivingColor } from "@/components/pages/map/const";
import { useAvoidMapScroll } from "@/components/pages/map/hooks/useAvoidMapScroll";
import {
  BusStop,
  GetBusArrivalQuery,
} from "@/graphql-codegen/frontend/graphql";
import { getTimeUntilArrival } from "@/utils/timeUtil";
import {
  Fragment,
  TouchEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMap } from "react-leaflet";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const map = useMap();

  // This state is used to prevent the component from re-rendering when the bus stop is the same
  //  with interval refetching, the component will re-render every time the interval is triggered
  //  to avoid the loading spinner for the list to be shown every time, we will set this state to false
  const [isSameBusStop, setIsSameBusStop] = useState(true);

  const containerOriginYRef = useRef<number | null>(null);
  const containerOriginalHeightRef = useRef<number | null>(null);
  const containerHeightOffsetRef = useRef<number | null>(null);

  const [containerHeight, setContainerHeight] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    if (containerRef.current) {
      containerOriginYRef.current =
        containerRef.current.getBoundingClientRect().y;
      containerOriginalHeightRef.current = containerRef.current.clientHeight;
    }
  }, []);

  useEffect(() => {
    if (!isSameBusStop) return;
    if (!isLoading && isSameBusStop) {
      setIsSameBusStop(false);
    }
  }, [isSameBusStop, isLoading]);

  useAvoidMapScroll(listRef);

  const handleHeaderTouchStart: TouchEventHandler = (e) => {
    map.dragging.disable();
    containerHeightOffsetRef.current =
      e.touches[0].clientY - containerRef.current!.getBoundingClientRect().y;
  };
  const handleHeaderTouchEnd: TouchEventHandler = () => {
    map.dragging.enable();
  };
  const handleHeaderTouchMove: TouchEventHandler = (e) => {
    setContainerHeight(
      Math.max(
        containerOriginalHeightRef.current!,
        containerOriginYRef.current! +
          containerOriginalHeightRef.current! -
          e.touches[0].clientY +
          containerHeightOffsetRef.current!,
      ),
    );
  };

  return (
    <div
      className="absolute bottom-0 left-1/2 z-[1000] flex h-1/3 w-full -translate-x-1/2 flex-col rounded-lg bg-gradient-to-l from-blue-50 via-blue-100 to-blue-200 shadow-md lg:bottom-[unset] lg:left-[unset] lg:right-8 lg:top-20 lg:h-[unset] lg:max-h-[67%] lg:min-w-[320px] lg:max-w-[400px] lg:translate-x-[unset]"
      ref={containerRef}
      style={{ height: containerHeight || undefined, maxHeight: "100svh" }}
    >
      <div
        className="flex flex-wrap items-end gap-2 p-4"
        onClick={() => onBusStopClick?.(busStop)}
        onTouchStart={handleHeaderTouchStart}
        onTouchEnd={handleHeaderTouchEnd}
        onTouchMove={handleHeaderTouchMove}
      >
        <div className="text-3xl font-bold">{busStop.code}</div>
        <div className="text-xl font-bold">{busStop.description}</div>
      </div>
      <hr className="border-t-2 border-gray-200" />

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
                    isSelected={
                      selectedService?.ServiceNo === service.ServiceNo
                    }
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
