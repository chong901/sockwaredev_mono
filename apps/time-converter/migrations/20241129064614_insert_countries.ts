import { DB } from "@/db/types";
import { readFileSync } from "fs";
import type { Kysely } from "kysely";
import path from "path";

type RawCountry = [
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

type CountryData = {
  iso: string;
  iso3: string;
  iso_numeric: string;
  fips: string;
  name: string;
  capital: string;
  area: string;
  population: string;
  continent: string;
  tld: string;
  currency_code: string;
  currency_name: string;
  phone: string;
  postal_code_format: string;
  postal_code_regex: string;
  languages: string;
  geonameid: string;
  neighbours: string;
  equivalent_fips_code: string;
};

const convertRawCountry = (line: string): CountryData => {
  const [
    iso,
    iso3,
    iso_numeric,
    fips,
    name,
    capital,
    area,
    population,
    continent,
    tld,
    currency_code,
    currency_name,
    phone,
    postal_code_format,
    postal_code_regex,
    languages,
    geonameid,
    neighbours,
    equivalent_fips_code,
  ] = line.split("\t") as RawCountry;

  return {
    iso,
    iso3,
    iso_numeric,
    fips,
    name,
    capital,
    area,
    population,
    continent,
    tld,
    currency_code,
    currency_name,
    phone,
    postal_code_format,
    postal_code_regex,
    languages,
    geonameid,
    neighbours,
    equivalent_fips_code,
  };
};

const readCountries = () => {
  const raw = readFileSync(path.join(__dirname, "../raw_data/countryInfo.txt"));
  const countries = raw.toString().split("\n").map(convertRawCountry);
  return countries;
};

export async function up(db: Kysely<DB>): Promise<void> {
  const countries = readCountries();
  for (const country of countries) {
    await db
      .insertInto("country")
      .values({
        code: country.iso,
        name: country.name,
      })
      .execute();
  }
  // up migration code goes here...
  // note: up migrations are mandatory. you must implement this function.
  // For more info, see: https://kysely.dev/docs/migrations
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom("country").execute();
  // down migration code goes here...
  // note: down migrations are optional. you can safely delete this function.
  // For more info, see: https://kysely.dev/docs/migrations
}
