import { City, GetCitiesResponse } from "@/types/api/cities";
import { atom, useAtom } from "jotai";
import { atomWithMutation } from "jotai-tanstack-query";

export const searchCitiesAtom = atomWithMutation(() => ({
  mutationKey: ["cities"],
  mutationFn: async (search: string) => {
    const response = await fetch(`/api/cities?search=${search}`);
    return ((await response.json()) as GetCitiesResponse).data;
  },
}));

const selectedCitiesAtom = atom<City[]>([]);

export const useCities = () => {
  const [selectedCities, setSelectedCities] = useAtom(selectedCitiesAtom);

  return {
    selectedCities,
    addCity: (city: City) => {
      setSelectedCities([...selectedCities, city]);
    },
    removeCity: (city: City) => {
      setSelectedCities(selectedCities.filter((c) => c.id !== city.id));
    },
  };
};
