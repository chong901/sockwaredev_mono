import { GetTimezonesResponse } from "@/types/api/timezones";
import { atom, useAtom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";

export const allTimezonesAtom = atomWithQuery(() => ({
  queryKey: ["timezones"],
  queryFn: async () => {
    const response = await fetch("/api/timezones");
    return ((await response.json()) as GetTimezonesResponse).data;
  },
}));

const mainTimezoneAtom = atom(Intl.DateTimeFormat().resolvedOptions().timeZone);

const mainDateTimeAtom = atom(new Date());

export const useMainTime = () => {
  const [mainDateTime, setMainDateTime] = useAtom(mainDateTimeAtom);
  const [mainTimezone, setMainTimezone] = useAtom(mainTimezoneAtom);

  return {
    mainDateTime,
    setMainDateTime,
    mainTimezone,
    setMainTimezone,
  };
};
