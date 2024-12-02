import { GetTimezonesResponse } from "@/types/api/timezones";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";

export const allTimezonesAtom = atomWithQuery(() => ({
  queryKey: ["timezones"],
  queryFn: async () => {
    const response = await fetch("/api/timezones");
    return ((await response.json()) as GetTimezonesResponse).data;
  },
}));

export const currentTimezoneAtom = atom(
  Intl.DateTimeFormat().resolvedOptions().timeZone,
);
