import { City } from "@/types/api/cities";
import { atom, useAtom } from "jotai";

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
