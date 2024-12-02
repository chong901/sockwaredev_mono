import { GetCitiesResponse } from "@/types/api/cities";
import { atomWithMutation } from "jotai-tanstack-query";

export const searchCitiesAtom = atomWithMutation(() => ({
  mutationKey: ["cities"],
  mutationFn: async (search: string) => {
    const response = await fetch(`/api/cities?search=${search}`);
    return ((await response.json()) as GetCitiesResponse).data;
  },
}));
