import { getBusArrivalQuery } from "@/components/pages/map/graphql";
import {
  GetBusArrivalQuery,
  GetBusArrivalQueryVariables,
} from "@/graphql-codegen/frontend/graphql";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";

export const useFetchBusArrival = (busCode: string | undefined) => {
  const { data, refetch, ...rest } = useQuery<
    GetBusArrivalQuery,
    GetBusArrivalQueryVariables
  >(getBusArrivalQuery, {
    variables: { code: busCode! },
    fetchPolicy: "no-cache",
    skip: !busCode,
  });

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

  return { data, refetch, ...rest };
};
