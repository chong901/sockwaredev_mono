import SearchInput from "@/components/molecules/SearchInput";
import { BusArrivalInfo } from "@/components/pages/map/BusArrivalInfo";
import BusStopSearchResult from "@/components/pages/map/BusStopSearchResult";
import {
  getBusStopsQuery,
  getNearestBusStopQuery,
  searchBusStopsQuery,
} from "@/components/pages/map/graphql";
import { useFetchBusArrival } from "@/components/pages/map/hooks/useFetchBusArrival";
import { BusStop } from "@/graphql-codegen/backend/types";
import {
  GetBusStopsQuery,
  GetBusStopsQueryVariables,
  GetNearestBusStopQuery,
  GetNearestBusStopQueryVariables,
  SearchBusStopsQuery,
  SearchBusStopsQueryVariables,
} from "@/graphql-codegen/frontend/graphql";
import { useAvoidMapScroll } from "@/hooks/useAvoidMapScroll";
import { useLazyQuery, useQuery } from "@apollo/client";
import { icon } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useClickAway, useDebounce } from "react-use";

type MapBodyProps = {
  currentUserLat: number;
  currentUserLong: number;
};

const busStopIcon = icon({ iconUrl: "/bus-stop.svg", iconSize: [40, 40] });
const selectedBusStopIcon = icon({
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
    map.panTo([currentUserLat, currentUserLong]);
  };

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
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
            click: () => setSelectedBusStop(stop),
          }}
        />
      ))}
      <SearchInput
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
            map.panTo([stop.latitude, stop.longitude]);
          }}
        />
      </SearchInput>
      {selectedBusStop && (
        <BusArrivalInfo
          busStop={selectedBusStop}
          busArrivalData={busArrivalData?.getBusArrival}
        />
      )}
      <div
        onClick={onCurrentLocationClick}
        className="absolute bottom-[calc(33.3%+12px)] right-[12px] z-[1000] flex h-10 w-10 cursor-pointer justify-center rounded-full bg-white p-2 lg:bottom-8 lg:right-8 lg:h-12 lg:w-12"
      >
        <img src="marker-icon.png" alt="go back to current location" />
      </div>
    </>
  );
};
