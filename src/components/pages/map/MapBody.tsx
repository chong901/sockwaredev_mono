import SearchInput from "@/components/molecules/SearchInput";
import { BusArrivalInfo } from "@/components/pages/map/BusArrivalInfo";
import BusStopSearchResult from "@/components/pages/map/BusStopSearchResult";
import {
  getBusStopsQuery,
  getNearestBusStopQuery,
  searchBusStopsQuery,
} from "@/components/pages/map/graphql";
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
  const searchAreaRef = useRef<HTMLDivElement>(null);
  const [getBusStopsVariables, setGetBusStopsVariables] =
    useState<GetBusStopsQueryVariables>({
      lat: currentUserLat,
      long: currentUserLong,
    });
  const { data, previousData } = useQuery<
    GetBusStopsQuery,
    GetBusStopsQueryVariables
  >(getBusStopsQuery, {
    variables: getBusStopsVariables,
    fetchPolicy: "cache-and-network",
  });

  const [searchBusStop, setSearchBusStop] = useState<string>("");

  const [search, { data: searchBusStopsResult }] = useLazyQuery<
    SearchBusStopsQuery,
    SearchBusStopsQueryVariables
  >(searchBusStopsQuery);

  const [selectedBusStop, setSelectedBusStop] = useState<BusStop | null>(null);

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

  useDebounce(
    () => {
      search({ variables: { search: searchBusStop } });
    },
    500,
    [searchBusStop],
  );

  useClickAway(searchAreaRef, () => {
    setShowSearchResult(false);
  });

  useAvoidMapScroll(searchAreaRef);

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
      {selectedBusStop && <BusArrivalInfo busStop={selectedBusStop} />}
    </>
  );
};
