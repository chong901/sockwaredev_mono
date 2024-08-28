import { getBusArrivalQuery } from "@/components/pages/map/graphql";
import {
  GetBusArrivalQuery,
  GetBusArrivalQueryVariables,
} from "@/graphql-codegen/frontend/graphql";
import { getTimeUntilArrival } from "@/utils/timeUtil";
import { useQuery } from "@apollo/client";
import { useInterval } from "react-use";

type BusArrivalInfoProps = {
  busCode: string;
};
export const BusArrivalInfo = ({ busCode }: BusArrivalInfoProps) => {
  const { data: busArrivalData, refetch } = useQuery<
    GetBusArrivalQuery,
    GetBusArrivalQueryVariables
  >(getBusArrivalQuery, {
    variables: { code: busCode },
    fetchPolicy: "no-cache",
  });

  useInterval(() => {
    refetch();
  }, 3000);

  return (
    <div className="absolute right-8 w-2/12 top-20 bg-slate-200 z-[1000] rounded-md">
      <div className="text-3xl text-slate-700 p-4">{busCode}</div>
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
  );
};
