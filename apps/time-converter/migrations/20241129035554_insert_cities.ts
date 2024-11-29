import { DB } from "@/db/types";
import { readFileSync } from "fs";
import type { Kysely } from "kysely";
import path from "path";

type RawData = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

type CityData = {
  geonameid: string;
  name: string;
  asciiname: string;
  alternatenames: string;
  latitude: number;
  longitude: number;
  feature_class: string;
  feature_code: string;
  country_code: string;
  cc2: string;
  admin1_code: string;
  admin2_code: string;
  admin3_code: string;
  admin4_code: string;
  population: string;
  elevation: string;
  dem: string;
  timezone: string;
  modification_date: string;
};

const readCities = () => {
  const citiesTxt = readFileSync(
    path.join(__dirname, "../raw_data/cities5000.txt"),
  );
  const cities = citiesTxt.toString().split("\n").map(convertRawData);
  return cities;
};

const convertRawData = (line: string): CityData => {
  const [
    geonameid,
    name,
    asciiname,
    alternatenames,
    latitude,
    longitude,
    feature_class,
    feature_code,
    country_code,
    cc2,
    admin1_code,
    admin2_code,
    admin3_code,
    admin4_code,
    population,
    elevation,
    dem,
    timezone,
    modification_date,
  ] = line.split("\t") as RawData;
  return {
    geonameid,
    name,
    asciiname,
    alternatenames,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    feature_class,
    feature_code,
    country_code,
    cc2,
    admin1_code,
    admin2_code,
    admin3_code,
    admin4_code,
    population,
    elevation,
    dem,
    timezone,
    modification_date,
  };
};

export async function up(db: Kysely<DB>): Promise<void> {
  const cities = readCities();
  for (const city of cities) {
    await db
      .insertInto("city")
      .values({
        name: city.name,
        country_code: city.country_code,
        timezone: city.timezone,
        modification_date: city.modification_date,
        admin1_code: city.admin1_code,
        admin2_code: city.admin2_code,
        admin3_code: city.admin3_code,
        admin4_code: city.admin4_code,
      })
      .onConflict((oc) => oc.doNothing())
      .execute();
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom("city").execute();
}
