import { City } from "@/types/api/cities";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const selectedCitiesAtom = atomWithStorage<City[]>("selectedCities", []);

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
