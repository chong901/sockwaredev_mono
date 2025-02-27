"use client";
import { defaultLat, defaultLng } from "@/components/pages/map/const";
import { MapBody } from "@/components/pages/map/MapBody";
import { useGeolocation } from "@repo/react-hook";
import { LoadingSpinner } from "@repo/ui/atoms";
import { PageContainer } from "@repo/ui/containers";
import { MapContainer } from "react-leaflet";

export default function MapPage() {
  const { loading, latitude, longitude } = useGeolocation({
    enableHighAccuracy: false,
    maximumAge: Infinity,
  });
  if (loading)
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    );
  return (
    <MapContainer
      center={
        latitude && longitude ? [latitude, longitude] : [defaultLat, defaultLng]
      }
      zoom={20}
      scrollWheelZoom={false}
      className="flex h-svh w-full"
    >
      <MapBody currentUserLat={latitude} currentUserLong={longitude} />
    </MapContainer>
  );
}
