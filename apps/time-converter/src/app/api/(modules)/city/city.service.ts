import { db } from "@/db/db";
import { sql } from "kysely";

export const CityService = {
  fetchCitiesBySearch: async (search: string, limit: number = 100) => {
    const data = await db
      .selectFrom("city")
      .leftJoin("country", "city.country_code", "country.code")
      .select([
        "city.id",
        "city.name",
        "country.name as country",
        "city.timezone",
        "city.admin1_code",
      ])
      .where("city.name", "ilike", `%${search}%`)
      .orderBy(
        sql`
        CASE 
            WHEN city.name ILIKE ${search} THEN 3  
            WHEN city.name ILIKE ${search + "%"} THEN 2 
            ELSE 1                                
        END DESC`,
      )
      .limit(limit)
      .execute();
    return data;
  },
};
