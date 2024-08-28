import { getBusArrivalQuery } from "@/components/pages/map/graphql";
import {
  BusStop,
  GetBusArrivalQuery,
  GetBusArrivalQueryVariables,
} from "@/graphql-codegen/frontend/graphql";
import { useAvoidMapScroll } from "@/hooks/useAvoidMapScroll";
import { getTimeUntilArrival } from "@/utils/timeUtil";
import { useQuery } from "@apollo/client";
import { useEffect, useRef } from "react";

type BusArrivalInfoProps = {
  busStop: BusStop;
};

const comingBusArrivingColor: Record<string, string> = {
  SEA: "text-green-500",
  SDA: "text-yellow-500",
  LSD: "text-red-500",
  default: "",
};

export const BusArrivalInfo = ({ busStop }: BusArrivalInfoProps) => {
  const { data: busArrivalData, refetch } = useQuery<
    GetBusArrivalQuery,
    GetBusArrivalQueryVariables
  >(getBusArrivalQuery, {
    variables: { code: busStop.code },
    fetchPolicy: "no-cache",
  });

  const listContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        interval = setInterval(
          () => {
            refetch();
          },
          parseInt(
            process.env.NEXT_PUBLIC_BUS_ARRIVAL_REFRESH_INTERVAL ?? "15000",
          ),
        );
      } else {
        clearInterval(interval);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refetch]);

  useAvoidMapScroll(listContainerRef);

  return (
    <div className="absolute bottom-0 left-1/2 z-[1000] flex h-1/3 w-full -translate-x-1/2 flex-col rounded-lg bg-gradient-to-l from-blue-50 via-blue-100 to-blue-200 shadow-md lg:bottom-[unset] lg:left-[unset] lg:right-8 lg:top-20 lg:h-[unset] lg:min-w-[320px] lg:max-w-[400px] lg:translate-x-[unset]">
      <div className="flex flex-wrap gap-2 p-4">
        <div className="text-3xl font-bold">{busStop.code}</div>
        <div className="text-3xl font-bold">{busStop.description}</div>
      </div>
      <hr className="border-t-2 border-gray-200" />
      <div
        className="flex flex-1 flex-col gap-2 overflow-scroll p-4"
        ref={listContainerRef}
      >
        <div className="flex w-full">
          <div className="text-sm">Bus No</div>
          <div className="ml-auto text-sm">Arriving in (mins)</div>
        </div>
        {busArrivalData?.getBusArrival.Services.map((service) => {
          const nextBuses = [
            service.NextBus,
            service.NextBus2,
            service.NextBus3,
          ];

          return (
            <div key={service.ServiceNo} className="flex">
              <div className="text-2xl">{service.ServiceNo}</div>
              <div className="ml-auto flex items-end gap-2">
                {nextBuses.map((bus, index) => (
                  <div
                    className={`text-right ${
                      index === 0
                        ? `text-2xl ${
                            comingBusArrivingColor[bus?.Load ?? "default"]
                          }`
                        : "w-4 text-base"
                    }`}
                    key={`${service.ServiceNo}-${index}`}
                  >
                    {bus ? getTimeUntilArrival(bus.EstimatedArrival) : ""}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
