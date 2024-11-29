import { db } from "@/db/db";

export const TimezoneService = {
  fetchTimezones: async () => {
    const data = await db
      .selectFrom("city")
      .select("timezone")
      .distinctOn("timezone")
      .execute();
    return data.map((row) => row.timezone);
  },
};
