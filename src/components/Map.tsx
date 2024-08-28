import { LoadingSpinner } from "@/components/atoms/LoadingSpinner";
import { PageContainer } from "@/components/containers/PageContainer";
import {
  BusStop,
  GetBusArrivalQuery,
  GetBusArrivalQueryVariables,
  GetBusStopsQuery,
  GetBusStopsQueryVariables,
  GetNearestBusStopQuery,
  GetNearestBusStopQueryVariables,
} from "@/graphql-codegen/frontend/graphql";
import useGeolocation from "@/hooks/useGeoLocation";
import { getTimeUntilArrival } from "@/utils/timeUtil";
import { gql, useQuery } from "@apollo/client";
import { icon } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

const getBusStopsQuery = gql`
  query GetBusStops($lat: Float!, $long: Float!) {
    getBusStops(lat: $lat, long: $long) {
      code
      description
      latitude
      longitude
      roadName
    }
  }
`;

const getNearestBusStopQuery = gql`
  query GetNearestBusStop($lat: Float!, $long: Float!) {
    getNearestBusStops(lat: $lat, long: $long) {
      code
      description
      latitude
      longitude
      roadName
    }
  }
`;

const getBusArrivalQuery = gql`
  query GetBusArrival($code: String!) {
    getBusArrival(code: $code) {
      Services {
        ServiceNo
        NextBus {
          ...BusArrivalData
        }

        NextBus2 {
          ...BusArrivalData
        }
        NextBus3 {
          ...BusArrivalData
        }
      }
    }
  }

  fragment BusArrivalData on BusArrival {
    EstimatedArrival
    Latitude
    Longitude
    Load
  }
`;

type MapBodyProps = {
  currentUserLat: number;
  currentUserLong: number;
};

const busStopIcon = icon({ iconUrl: "/bus-stop.svg", iconSize: [40, 40] });
const selectedBusStopIcon = icon({
  iconUrl: "/bus-stop-selected.svg",
  iconSize: [60, 60],
});

const MapBody = ({ currentUserLat, currentUserLong }: MapBodyProps) => {
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

  const [selectedBusStop, setSelectedBusStop] = useState<BusStop | null>(null);

  const { data: nearestBusStop } = useQuery<
    GetNearestBusStopQuery,
    GetNearestBusStopQueryVariables
  >(getNearestBusStopQuery, {
    variables: { lat: currentUserLat, long: currentUserLong },
    skip: selectedBusStop !== null,
  });

  const { data: busArrivalData } = useQuery<
    GetBusArrivalQuery,
    GetBusArrivalQueryVariables
  >(getBusArrivalQuery, {
    variables: { code: selectedBusStop?.code! },
    skip: !selectedBusStop,
    fetchPolicy: "no-cache",
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

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
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

      <div className="absolute right-8 w-2/12 top-20 bg-slate-200 z-[1000] rounded-md">
        <div className="text-3xl text-slate-700 p-4">
          {selectedBusStop?.code}
        </div>
        {busArrivalData?.getBusArrival.Services.map((service) => {
          const nextBuses = [
            service.NextBus,
            service.NextBus2,
            service.NextBus3,
          ].filter((bus) => bus);

          return (
            <div key={service.ServiceNo} className="flex p-4">
              <div className="text-2xl text-slate-700">{service.ServiceNo}</div>
              <div className="ml-auto flex gap-2 items-end">
                {nextBuses.map((bus, index) => (
                  <div
                    className={`text-slate-700 ${
                      index === 0 ? "text-2xl" : "text-base"
                    }`}
                    key={`${service.ServiceNo}-${index}`}
                  >
                    {getTimeUntilArrival(bus!.EstimatedArrival)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default function Map() {
  const { loading, latitude, longitude } = useGeolocation();
  if (loading || !latitude || !longitude)
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={20}
      scrollWheelZoom={false}
      className="flex h-screen w-full"
    >
      <MapBody currentUserLat={latitude} currentUserLong={longitude} />
    </MapContainer>
  );
}
