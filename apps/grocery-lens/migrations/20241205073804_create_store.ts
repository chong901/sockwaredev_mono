import { sql, type Kysely } from "kysely";
import { withCreatedAtUpdatedAtColumns } from "./util/timestamp";

export async function up(db: Kysely<any>): Promise<void> {
  await withCreatedAtUpdatedAtColumns(
    db.schema
      .createTable("store")
      .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
      .addColumn("name", "varchar", (col) => col.notNull())
      .addColumn("user_id", "uuid", (col) => col.references("user.id").notNull()),
  ).execute();

  await db.schema.createIndex("store_user_id_name_uniq").on("store").columns(["user_id", "name"]).unique().execute();
  // up migration code goes here...
  // note: up migrations are mandatory. you must implement this function.
  // For more info, see: https://kysely.dev/docs/migrations
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex("store_user_id_name_uniq").execute();
  await db.schema.dropTable("store").execute();
  // down migration code goes here...
  // note: down migrations are optional. you can safely delete this function.
  // For more info, see: https://kysely.dev/docs/migrations
}
