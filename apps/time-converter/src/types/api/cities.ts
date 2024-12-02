export type GetCitiesResponse = {
  data: City[];
};

export type City = {
  id: string;
  admin1_code: string | null;
  name: string;
  timezone: string;
  country: string | null;
};
