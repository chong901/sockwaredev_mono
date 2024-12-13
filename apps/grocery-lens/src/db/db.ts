import { DB } from "@/db/types";
import { Kysely, PostgresDialect } from "kysely";
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

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<DB>({
  dialect,
  log(event): void {
    const logLevels = (process.env.DB_LOG_LEVELS || "error").split(",");
    if (logLevels.includes(event.level)) {
      console.log("=============================");
      console.log(event.query.sql);
      console.log(event.query.parameters);
      console.log(event.queryDurationMillis);
      console.log("=============================");
    }
  },
});
