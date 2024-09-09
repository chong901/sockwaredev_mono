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
  MouseEventHandler,
  TouchEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMap } from "react-leaflet";
import { useLocalStorage, useMedia } from "react-use";

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
  const isMobile = useMedia("(max-width: 767px)");

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

  const [favoriteBusStops, setFavoriteBusStops] =
    useLocalStorage<string[]>("favoriteBusStops");

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
  const handleFavoriteClick: MouseEventHandler<SVGSVGElement> = (e) => {
    e.stopPropagation();
    if (favoriteBusStops?.includes(busStop.code)) {
      setFavoriteBusStops(
        favoriteBusStops?.filter((code) => code !== busStop.code),
      );
    } else {
      setFavoriteBusStops([...(favoriteBusStops ?? []), busStop.code]);
    }
  };

  return (
    <div
      className="absolute bottom-0 left-1/2 z-[1000] flex h-1/3 w-full -translate-x-1/2 flex-col rounded-lg bg-gradient-to-l from-blue-50 via-blue-100 to-blue-200 shadow-md md:bottom-[unset] md:left-[unset] md:right-8 md:top-20 md:h-[unset] md:max-h-[67%] md:min-w-[320px] md:max-w-[400px] md:translate-x-[unset]"
      ref={containerRef}
      style={
        isMobile
          ? { height: containerHeight || undefined, maxHeight: "100svh" }
          : undefined
      }
    >
      <div
        className="flex flex-wrap items-end gap-2 p-4"
        onClick={() => onBusStopClick?.(busStop)}
        onTouchStart={isMobile ? handleHeaderTouchStart : undefined}
        onTouchEnd={isMobile ? handleHeaderTouchEnd : undefined}
        onTouchMove={isMobile ? handleHeaderTouchMove : undefined}
      >
        <div className="text-3xl font-bold">{busStop.code}</div>
        <div className="text-xl font-bold">{busStop.description}</div>
        <svg
          onClick={handleFavoriteClick}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className={`ml-auto h-8 ${favoriteBusStops?.includes(busStop.code) ? "fill-current text-yellow-500" : ""}`}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
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
