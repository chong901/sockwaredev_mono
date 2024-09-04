import SearchInput from "@/components/molecules/SearchInput";
import { BusArrivalInfo } from "@/components/pages/map/BusArrivalInfo";
import { BusMarker } from "@/components/pages/map/BusMarker";
import BusStopSearchResult from "@/components/pages/map/BusStopSearchResult";
import {
  getBusRoutesQuery,
  getBusStopsQuery,
  getNearestBusStopQuery,
  searchBusStopsQuery,
} from "@/components/pages/map/graphql";
import { useFetchBusArrival } from "@/components/pages/map/hooks/useFetchBusArrival";
import { BusStop } from "@/graphql-codegen/backend/types";
import {
  GetBusArrivalQuery,
  GetBusRoutesQuery,
  GetBusRoutesQueryVariables,
  GetBusStopsQuery,
  GetBusStopsQueryVariables,
  GetNearestBusStopQuery,
  GetNearestBusStopQueryVariables,
  SearchBusStopsQuery,
  SearchBusStopsQueryVariables,
} from "@/graphql-codegen/frontend/graphql";
import { useAvoidMapScroll } from "@/hooks/useAvoidMapScroll";
import { useLazyQuery, useQuery } from "@apollo/client";
import { icon, LatLngExpression } from "leaflet";
import Image from "next/image";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  Marker,
  Polyline,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useClickAway, useDebounce } from "react-use";

type MapBodyProps = {
  currentUserLat: number;
  currentUserLong: number;
};

const busStopIcon = icon({ iconUrl: "/bus-stop.svg", iconSize: [40, 40] });
const selectedBusStopIcon = icon({
  className: "border-2 border-[#542400] rounded-full",
  iconUrl: "/bus-stop-selected.svg",
  iconSize: [60, 60],
});

export const MapBody = ({ currentUserLat, currentUserLong }: MapBodyProps) => {
  const [showSearchResult, setShowSearchResult] = useState<boolean>(false);

  const [getBusStopsVariables, setGetBusStopsVariables] =
    useState<GetBusStopsQueryVariables>({
      lat: currentUserLat,
      long: currentUserLong,
    });

  const [searchBusStop, setSearchBusStop] = useState<string>("");

  const [selectedBusStop, setSelectedBusStop] = useState<BusStop | null>(null);

  const [selectedBusService, setSelectedBusService] = useState<
    GetBusArrivalQuery["getBusArrival"]["Services"][number] | undefined
  >(undefined);

  const { data, previousData } = useQuery<
    GetBusStopsQuery,
    GetBusStopsQueryVariables
  >(getBusStopsQuery, {
    variables: getBusStopsVariables,
    fetchPolicy: "cache-and-network",
  });

  const [search, { data: searchBusStopsResult }] = useLazyQuery<
    SearchBusStopsQuery,
    SearchBusStopsQueryVariables
  >(searchBusStopsQuery);

  const { data: nearestBusStop } = useQuery<
    GetNearestBusStopQuery,
    GetNearestBusStopQueryVariables
  >(getNearestBusStopQuery, {
    variables: { lat: currentUserLat, long: currentUserLong },
    skip: selectedBusStop !== null,
  });

  const { data: busRoutePolylines } = useQuery<
    GetBusRoutesQuery,
    GetBusRoutesQueryVariables
  >(getBusRoutesQuery, {
    variables: {
      serviceNo: selectedBusService?.ServiceNo ?? "",
      originBusStopCode: selectedBusService?.NextBus?.OriginCode ?? "",
    },
    skip:
      !selectedBusService ||
      !selectedBusService.ServiceNo ||
      !selectedBusService.NextBus?.OriginCode,
  });

  useEffect(() => {
    if (nearestBusStop) {
      setSelectedBusStop(nearestBusStop.getNearestBusStops);
    }
  }, [nearestBusStop]);

  useMapEvents({
    moveend: (event) => {
      const newCenter = event.target.getCenter();
      const newLat = newCenter.lat;
      const newLong = newCenter.lng;
      setGetBusStopsVariables({ lat: newLat, long: newLong });
    },
  });
  const map = useMap();

  const { data: busArrivalData } = useFetchBusArrival(selectedBusStop?.code);

  useDebounce(
    () => {
      search({ variables: { search: searchBusStop } });
    },
    500,
    [searchBusStop],
  );

  const searchAreaRef = useRef<HTMLDivElement>(null);

  useClickAway(searchAreaRef, () => {
    setShowSearchResult(false);
  });

  useAvoidMapScroll(searchAreaRef);

  const onCurrentLocationClick = () => {
    map.flyTo([currentUserLat, currentUserLong]);
  };

  const displayBusServices = useMemo(() => {
    if (!selectedBusService)
      return busArrivalData?.getBusArrival.Services ?? [];
    return (
      busArrivalData?.getBusArrival.Services.filter(
        (service) => service.ServiceNo === selectedBusService.ServiceNo,
      ) ?? []
    );
  }, [busArrivalData?.getBusArrival.Services, selectedBusService]);

  useEffect(() => {
    if (!selectedBusService) return;
    const firstBus = selectedBusService.NextBus;
    if (!firstBus || !firstBus.Latitude || !firstBus.Longitude) return;
    selectedBusService.NextBus?.OriginCode;

    const lat = parseFloat(firstBus.Latitude);
    const long = parseFloat(firstBus.Longitude);
    if (lat === 0 && long === 0) return;
    map.flyTo([parseFloat(firstBus.Latitude), parseFloat(firstBus.Longitude)]);
  }, [map, selectedBusService]);

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {displayBusServices.map(({ ServiceNo, NextBus2, NextBus3, NextBus }) => {
        return (
          <Fragment key={ServiceNo}>
            {NextBus && <BusMarker bus={NextBus} text={ServiceNo} />}
            {NextBus2 && <BusMarker bus={NextBus2} text={ServiceNo} />}
            {NextBus3 && <BusMarker bus={NextBus3} text={ServiceNo} />}
          </Fragment>
        );
      })}
      {busRoutePolylines?.getBusRoutes.map((polyline, index) => (
        <Polyline
          key={index}
          positions={polyline as LatLngExpression[]}
          pathOptions={{ color: "red" }}
        />
      ))}
      <Marker position={[currentUserLat, currentUserLong]} />
      {(data || previousData)?.getBusStops.map((stop) => (
        <Marker
          key={stop.code}
          position={[stop.latitude, stop.longitude]}
          icon={
            stop.code === selectedBusStop?.code
              ? selectedBusStopIcon
              : busStopIcon
          }
          eventHandlers={{
            click: () => {
              setSelectedBusStop(stop);
              setSelectedBusService(undefined);
            },
          }}
        />
      ))}
      <SearchInput
        placeholder="Bus stop code or name"
        value={searchBusStop}
        onChange={(e) => setSearchBusStop(e.target.value)}
        onClear={() => setSearchBusStop("")}
        onFocus={() => setShowSearchResult(true)}
        ref={searchAreaRef}
      >
        <BusStopSearchResult
          showSearchResult={showSearchResult}
          busStops={searchBusStopsResult?.searchBusStops}
          onItemClick={(stop) => {
            setSelectedBusStop(stop);
            setShowSearchResult(false);
            map.flyTo([stop.latitude, stop.longitude]);
          }}
        />
      </SearchInput>
      {selectedBusStop && (
        <BusArrivalInfo
          busStop={selectedBusStop}
          busArrivalData={busArrivalData?.getBusArrival}
          onServiceClick={setSelectedBusService}
          selectedService={selectedBusService}
          onBusStopClick={(busStop) =>
            map.flyTo([busStop.latitude, busStop.longitude])
          }
        />
      )}
      <div
        onClick={onCurrentLocationClick}
        className="absolute bottom-[calc(33.3%+12px)] right-[12px] z-[1000] flex h-10 w-10 cursor-pointer justify-center rounded-full bg-white p-2 lg:bottom-8 lg:right-8 lg:h-12 lg:w-12"
      >
        <Image
          src="/marker-icon.png"
          width={20}
          height={20}
          alt="go back to current location"
        />
      </div>
    </>
  );
};
