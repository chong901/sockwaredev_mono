import { Kysely, PostgresDialect } from "kysely";
import { defineConfig, getKnexTimestampPrefix } from "kysely-ctl";
import { Pool } from "pg";

const dialect = new PostgresDialect({
  pool: new Pool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    password: process.env.DB_PASSWORD || "1234",
    user: process.env.DB_USER || "postgres",
    database: process.env.DB_NAME || "postgres",
    max: 10,
  }),
});

const db = new Kysely<any>({
  dialect,
  log(event): void {
    if (event.level === "error") {
      console.log("=============================");
      console.log(event.query.sql);
      console.log(event.query.parameters);
      console.log(event.queryDurationMillis);
      console.log("=============================");
    }
  },
});

export default defineConfig({
  kysely: db,
  migrations: {
    migrationFolder: "migrations",
    getMigrationPrefix: getKnexTimestampPrefix,
  },
  //   plugins: [],
  //   seeds: {
  //     seedFolder: "seeds",
  //   }
});
