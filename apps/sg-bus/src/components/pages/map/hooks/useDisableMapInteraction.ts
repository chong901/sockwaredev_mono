import { useEffect } from "react";
import { useMap } from "react-leaflet";

export const useDisableMapInteraction = (disable: boolean) => {
  const map = useMap();

  useEffect(() => {
    if (disable) {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.touchZoom.disable();
      map.boxZoom.disable();
    } else {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.touchZoom.enable();
      map.boxZoom.enable();
    }
  }, [disable, map]);
};
