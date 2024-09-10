import PwaInstallPrompt from "@/components/molecules/PwaInstallPrompt";
import SearchInput from "@/components/molecules/SearchInput";
import { defaultLat, defaultLng } from "@/components/pages/map/const";
import {
  getBusRoutesQuery,
  getBusStopsQuery,
  getNearestBusStopQuery,
  searchBusStopsQuery,
} from "@/components/pages/map/graphql";
import { useAvoidMapScroll } from "@/components/pages/map/hooks/useAvoidMapScroll";
import { useFavoriteBusStops } from "@/components/pages/map/hooks/useFavoriteBusStops";
import { useFetchBusArrival } from "@/components/pages/map/hooks/useFetchBusArrival";
import { BusMarker } from "@/components/pages/map/molecules/BusMarker";
import { BusArrivalInfo } from "@/components/pages/map/organisms/BusArrivalInfo";
import BusStopSearchResult from "@/components/pages/map/organisms/BusStopSearchResult";
import { FavoriteBusStopInfo } from "@/components/pages/map/organisms/FavoriteBusStopInfo";
import { SaveFavoriteBusStopModal } from "@/components/pages/map/organisms/SaveFavoriteBusStopModal";
import {
  BusStop,
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
import { useSearchParamWithDefault } from "@/hooks/useSearchParamWithDefault";
import { selectedBusStopAtom } from "@/store/atoms/busStopAtoms";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useAtom } from "jotai";
import { icon, LatLngExpression } from "leaflet";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Fragment,
  MouseEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Marker,
  Polyline,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useClickAway, useDebounce, useToggle } from "react-use";

type MapBodyProps = {
  currentUserLat?: number;
  currentUserLong?: number;
};

const busStopIcon = icon({ iconUrl: "/bus-stop.svg", iconSize: [40, 40] });
const selectedBusStopIcon = icon({
  className: "border-2 border-[#542400] rounded-full",
  iconUrl: "/bus-stop-selected.svg",
  iconSize: [48, 48],
});

export const MapBody = ({ currentUserLat, currentUserLong }: MapBodyProps) => {
  const [showSearchResult, setShowSearchResult] = useState<boolean>(false);

  const [getBusStopsVariables, setGetBusStopsVariables] =
    useState<GetBusStopsQueryVariables>({
      lat: currentUserLat ?? defaultLat,
      long: currentUserLong ?? defaultLng,
    });
  const [showSaveFavoriteBusStopModal, toggleShowSaveFavoriteBusStopModal] =
    useToggle(false);

  const [searchBusStop, setSearchBusStop] = useState<string>("");

  const [selectedBusStop, setSelectedBusStop] = useAtom(selectedBusStopAtom);

  const hasCurrentUserLocation = currentUserLat && currentUserLong;

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
    variables: {
      lat: currentUserLat ?? defaultLat,
      long: currentUserLong ?? defaultLng,
    },
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
  }, [nearestBusStop, setSelectedBusStop]);

  useMapEvents({
    moveend: (event) => {
      const newCenter = event.target.getCenter();
      const newLat = newCenter.lat;
      const newLong = newCenter.lng;
      setGetBusStopsVariables({ lat: newLat, long: newLong });
    },
  });
  const map = useMap();

  const { data: busArrivalData, loading: busArrivalLoading } =
    useFetchBusArrival(selectedBusStop?.code);

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
    if (!currentUserLat || !currentUserLong) return;
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
  const tag = useSearchParamWithDefault("tag", "home") as "home" | "favorites";
  const { hasFavoriteBusStop, removeFavoriteBusStop, addFavoriteBusStop } =
    useFavoriteBusStops();
  const handleFavoriteClick: MouseEventHandler = (e) => {
    e.stopPropagation();
    if (!selectedBusStop) return;
    if (hasFavoriteBusStop(selectedBusStop)) {
      removeFavoriteBusStop(selectedBusStop);
    } else {
      toggleShowSaveFavoriteBusStopModal(true);
    }
  };

  const handleSaveFavoriteBusStop = (name: string, busStop: BusStop) => {
    if (!selectedBusStop) return;
    addFavoriteBusStop({ name, busStop });
    toggleShowSaveFavoriteBusStopModal(false);
  };

  const router = useRouter();

  const renderInfo = () => {
    switch (tag) {
      case "home": {
        if (!selectedBusStop) return null;
        return (
          <BusArrivalInfo
            busStop={selectedBusStop}
            isLoading={busArrivalLoading}
            busArrivalData={busArrivalData?.getBusArrival}
            onServiceClick={setSelectedBusService}
            selectedService={selectedBusService}
            onFavoriteClick={handleFavoriteClick}
          />
        );
      }
      case "favorites": {
        return <FavoriteBusStopInfo />;
      }
    }
  };

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <PwaInstallPrompt />
      {selectedBusStop && showSaveFavoriteBusStopModal && (
        <SaveFavoriteBusStopModal
          busStop={selectedBusStop}
          onClose={() => toggleShowSaveFavoriteBusStopModal(false)}
          onSave={handleSaveFavoriteBusStop}
        />
      )}
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
      {hasCurrentUserLocation && (
        <Marker position={[currentUserLat, currentUserLong]} />
      )}
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
              router.replace("?tag=home");
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
      {renderInfo()}
      {hasCurrentUserLocation && (
        <div
          onClick={onCurrentLocationClick}
          className="absolute bottom-[calc(33.3%+12px)] right-[12px] z-[999] flex h-10 w-10 cursor-pointer justify-center rounded-full bg-white p-2 md:bottom-8 md:right-8 md:h-12 md:w-12"
        >
          <Image
            src="/marker-icon.png"
            width={20}
            height={20}
            alt="go back to current location"
            className="w-4 md:w-5"
          />
        </div>
      )}
    </>
  );
};
