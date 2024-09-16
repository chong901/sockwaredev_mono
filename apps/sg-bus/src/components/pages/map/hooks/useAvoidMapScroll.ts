import { DomEvent } from "leaflet";
import { useEffect } from "react";

export const useAvoidMapScroll = (ref: React.RefObject<HTMLDivElement>) => {
  useEffect(() => {
    if (!ref.current) return;
    DomEvent.disableClickPropagation(ref.current!);
    DomEvent.disableScrollPropagation(ref.current!);
    DomEvent.on(ref.current!, "touchstart", DomEvent.stopPropagation);
  }, [ref]);
};
