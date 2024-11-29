export type GetCitiesResponse = {
  data: {
    id: string;
    admin1_code: string | null;
    name: string;
    timezone: string;
    country: string | null;
  }[];
};
