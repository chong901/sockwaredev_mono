import { PostgresDialect } from "kysely";
import { defineConfig, getKnexTimestampPrefix } from "kysely-ctl";
import { Pool } from "pg";

export default defineConfig({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.DB_HOST ?? "localhost",
      port: parseInt(process.env.DB_PORT ?? "5432"),
      password: process.env.DB_PASSWORD ?? "1234",
      user: process.env.DB_USER ?? "postgres",
      database: process.env.DB_NAME ?? "postgres",
    }),
  }),
  migrations: {
    migrationFolder: "migrations",
    getMigrationPrefix: getKnexTimestampPrefix,
  },
  //   plugins: [],
  //   seeds: {
  //     seedFolder: "seeds",
  //   }
});
