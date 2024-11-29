import { GetTimezonesResponse } from "@/types/api/timezones";
import { atomWithQuery } from "jotai-tanstack-query";

export const allTimezonesAtom = atomWithQuery(() => ({
  queryKey: ["timezones"],
  queryFn: async () => {
    const response = await fetch("/api/timezones");
    return ((await response.json()) as GetTimezonesResponse).data;
  },
}));
