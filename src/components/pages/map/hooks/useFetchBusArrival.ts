import { getBusArrivalQuery } from "@/components/pages/map/graphql";
import {
  GetBusArrivalQuery,
  GetBusArrivalQueryVariables,
} from "@/graphql-codegen/frontend/graphql";
import { useQuery } from "@apollo/client";
import { useEffect, useRef } from "react";

export const useFetchBusArrival = (busCode: string | undefined) => {
  const { data, refetch, ...rest } = useQuery<
    GetBusArrivalQuery,
    GetBusArrivalQueryVariables
  >(getBusArrivalQuery, {
    variables: { code: busCode! },
    fetchPolicy: "no-cache",
    skip: !busCode,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const interval = parseInt(
    process.env.NEXT_PUBLIC_BUS_ARRIVAL_REFRESH_INTERVAL ?? "15000",
  );
  useEffect(() => {
    // when user visit the page, at this point, visibility change is not triggered
    intervalRef.current = setInterval(() => {
      refetch();
    }, interval);

    const handleVisibilityChange = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (document.visibilityState === "visible") {
        // trigger refetch immediately once user comes back to the page
        refetch();
        intervalRef.current = setInterval(() => {
          refetch();
        }, interval);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refetch]);

  return { data, refetch, ...rest };
};
