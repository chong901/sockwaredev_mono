import { db } from "@/db/db";

export const CityService = {
  fetchCitiesBySearch: async (search: string, limit: number = 100) => {
    const data = await db
      .selectFrom("city")
      .leftJoin("country", "city.country_code", "country.code")
      .select([
        "city.name",
        "country.name as country",
        "city.timezone",
        "city.admin1_code",
      ])
      .where("name", "like", `%${search}%`)
      .limit(limit)
      .execute();
    return data;
  },
};
