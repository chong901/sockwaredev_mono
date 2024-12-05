import { sql, type Kysely } from "kysely";
import { withCreatedAtUpdatedAtColumns } from "./util/timestamp";

export async function up(db: Kysely<any>): Promise<void> {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`.execute(db);

  await withCreatedAtUpdatedAtColumns(
    db.schema
      .createTable("user")
      .addColumn("id", "uuid", (col) =>
        col.primaryKey().defaultTo(sql`gen_random_uuid()`),
      )
      .addColumn("email", "varchar", (col) => col.notNull().unique())
      .addColumn("name", "varchar")
      .addColumn("image", "varchar"),
  ).execute();
  // up migration code goes here...
  // note: up migrations are mandatory. you must implement this function.
  // For more info, see: https://kysely.dev/docs/migrations
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP EXTENSION IF EXISTS "uuid-ossp"`.execute(db);
  await db.schema.dropTable("user").execute();
  // down migration code goes here...
  // note: down migrations are optional. you can safely delete this function.
  // For more info, see: https://kysely.dev/docs/migrations
}
