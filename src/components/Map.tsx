import { LoadingSpinner } from "@/components/atoms/LoadingSpinner";
import { PageContainer } from "@/components/containers/PageContainer";
import {
  GetBusStopsQuery,
  GetBusStopsQueryVariables,
  GetNearestBusStopQuery,
  GetNearestBusStopQueryVariables,
} from "@/graphql-codegen/frontend/graphql";
import useGeolocation from "@/hooks/useGeoLocation";
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
  const { data, loading } = useQuery<
    GetBusStopsQuery,
    GetBusStopsQueryVariables
  >(getBusStopsQuery, { variables: getBusStopsVariables });

  const [selectedBusStopCode, setSelectedBusStop] = useState<string | null>(
    null
  );

  const { data: nearestBusStop } = useQuery<
    GetNearestBusStopQuery,
    GetNearestBusStopQueryVariables
  >(getNearestBusStopQuery, {
    variables: { lat: currentUserLat, long: currentUserLong },
    skip: selectedBusStopCode !== null,
  });

  useEffect(() => {
    if (nearestBusStop) {
      setSelectedBusStop(nearestBusStop.getNearestBusStops.code);
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
      {data?.getBusStops.map((stop) => (
        <Marker
          key={stop.code}
          position={[stop.latitude, stop.longitude]}
          icon={
            stop.code === selectedBusStopCode
              ? selectedBusStopIcon
              : busStopIcon
          }
          eventHandlers={{
            click: () => setSelectedBusStop(stop.code),
          }}
        />
      ))}

      <div className="absolute right-8 w-3/12 top-20 bg-slate-200 h-10 z-[1000] rounded-md">
        Test
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
