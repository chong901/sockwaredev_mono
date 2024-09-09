import BottomNavigation from "@/components/organisms/BottomNavigation";
import {
  MouseEventHandler,
  ReactNode,
  TouchEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMap } from "react-leaflet";
import { useMedia } from "react-use";

type InfoContainerProps = {
  children: ReactNode;
  header: ReactNode;
  onHeaderClick?: MouseEventHandler<HTMLDivElement>;
};
export const InfoContainer = ({
  children,
  header,
  onHeaderClick,
}: InfoContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMedia("(max-width: 767px)");
  const [containerHeight, setContainerHeight] = useState<number | undefined>(
    undefined,
  );
  const map = useMap();
  const containerOriginYRef = useRef<number | null>(null);
  const containerOriginalHeightRef = useRef<number | null>(null);
  const containerHeightOffsetRef = useRef<number | null>(null);

  const handleHeaderTouchStart: TouchEventHandler = (e) => {
    map.dragging.disable();
    containerHeightOffsetRef.current =
      e.touches[0].clientY - containerRef.current!.getBoundingClientRect().y;
  };
  const handleHeaderTouchEnd: TouchEventHandler = () => {
    map.dragging.enable();
  };
  const handleHeaderTouchMove: TouchEventHandler = (e) => {
    setContainerHeight(
      Math.max(
        containerOriginalHeightRef.current!,
        containerOriginYRef.current! +
          containerOriginalHeightRef.current! -
          e.touches[0].clientY +
          containerHeightOffsetRef.current!,
      ),
    );
  };

  useEffect(() => {
    if (containerRef.current) {
      containerOriginYRef.current =
        containerRef.current.getBoundingClientRect().y;
      containerOriginalHeightRef.current = containerRef.current.clientHeight;
    }
  }, []);

  return (
    <div
      className={`absolute bottom-0 left-1/2 z-[1000] flex h-1/3 w-full -translate-x-1/2 flex-col rounded-lg bg-gradient-to-l from-blue-50 via-blue-100 to-blue-200 shadow-md md:bottom-[unset] md:left-[unset] md:right-8 md:top-20 md:h-[unset] md:max-h-[67%] md:min-w-[320px] md:max-w-[400px] md:translate-x-[unset]`}
      ref={containerRef}
      style={
        isMobile
          ? { height: containerHeight || undefined, maxHeight: "100svh" }
          : undefined
      }
    >
      <div
        className="flex items-end gap-2 p-4"
        onTouchStart={isMobile ? handleHeaderTouchStart : undefined}
        onTouchEnd={isMobile ? handleHeaderTouchEnd : undefined}
        onTouchMove={isMobile ? handleHeaderTouchMove : undefined}
        onClick={onHeaderClick}
      >
        {header}
      </div>
      <hr className="border-t-2 border-gray-200" />
      {children}
      <hr className="border-t-2 border-gray-200" />
      <BottomNavigation />
    </div>
  );
};
