import { LoadingSpinner } from "@/components/atoms/LoadingSpinner";
import { PageContainer } from "@/components/containers/PageContainer";
import {
  GetBusStopsQuery,
  GetBusStopsQueryVariables,
} from "@/graphql-codegen/frontend/graphql";
import useGeolocation from "@/hooks/useGeoLocation";
import { gql, useQuery } from "@apollo/client";
import { divIcon } from "leaflet";
import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

const query = gql`
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
type MapBodyProps = {
  latitude: number;
  longitude: number;
};

const MapBody = ({ latitude, longitude }: MapBodyProps) => {
  const [getBusStopsVariables, setGetBusStopsVariables] =
    useState<GetBusStopsQueryVariables>({ lat: latitude, long: longitude });
  const { data, loading } = useQuery<
    GetBusStopsQuery,
    GetBusStopsQueryVariables
  >(query, { variables: getBusStopsVariables });

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
          icon={divIcon({ className: "w-10 h-10 bg-red-600" })}
        />
      ))}
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
      <MapBody latitude={latitude} longitude={longitude} />
    </MapContainer>
  );
}
