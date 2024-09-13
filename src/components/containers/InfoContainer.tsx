import BottomNavigation from "@/components/organisms/BottomNavigation";
import { atom, useAtom } from "jotai";
import {
  MouseEventHandler,
  ReactNode,
  RefObject,
  TouchEventHandler,
  useEffect,
  useRef,
} from "react";
import { useMap } from "react-leaflet";
import { useMedia } from "react-use";

const infoContainerRefAtom = atom<RefObject<HTMLDivElement> | null>(null);
const containerHeightAtom = atom<number | undefined>(undefined);

type InfoContainerProps = {
  children: ReactNode;
};

export const InfoContainer = ({ children }: InfoContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMedia("(max-width: 767px)");
  const [containerHeight] = useAtom(containerHeightAtom);
  const [_, setInfoContainerRef] = useAtom(infoContainerRefAtom);

  useEffect(() => {
    setInfoContainerRef(containerRef);
  }, [setInfoContainerRef]);

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
      {children}
      <hr className="border-t-2 border-gray-200" />
      <BottomNavigation />
    </div>
  );
};

type InfoHeaderProps = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
};
export const InfoHeader = ({ children, onClick }: InfoHeaderProps) => {
  const [containerRef] = useAtom(infoContainerRefAtom);
  const [_, setContainerHeight] = useAtom(containerHeightAtom);
  const isMobile = useMedia("(max-width: 767px)");

  const containerOriginYRef = useRef<number | null>(null);
  const containerOriginalHeightRef = useRef<number | null>(null);
  const containerHeightOffsetRef = useRef<number | null>(null);

  const map = useMap();

  const handleHeaderTouchStart: TouchEventHandler = (e) => {
    map.dragging.disable();
    containerHeightOffsetRef.current =
      e.touches[0].clientY -
      (containerRef?.current?.getBoundingClientRect().y ?? 0);
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
    if (containerRef?.current) {
      containerOriginYRef.current =
        containerRef.current.getBoundingClientRect().y;
      containerOriginalHeightRef.current = containerRef.current.clientHeight;
    }
  }, [containerRef]);

  return (
    <>
      <div
        className="flex items-end gap-2 p-4"
        onTouchStart={isMobile ? handleHeaderTouchStart : undefined}
        onTouchEnd={isMobile ? handleHeaderTouchEnd : undefined}
        onTouchMove={isMobile ? handleHeaderTouchMove : undefined}
        onClick={onClick}
      >
        {children}
      </div>
      <hr className="border-t-2 border-gray-200" />
    </>
  );
};
