import { City } from "@/types/api/cities";

export const CityHelper = {
  getDisplayName: (city: City) => {
    return [city?.name, city?.country, city?.timezone]
      .filter(Boolean)
      .join(", ");
  },
  getCityCountryName: (city: City) => {
    return [city?.name, city?.country].filter(Boolean).join(", ");
  },
};
