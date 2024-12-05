import { sql, type Kysely } from "kysely";
import { withCreatedAtUpdatedAtColumns } from "./util/timestamp";

export async function up(db: Kysely<any>): Promise<void> {
  await withCreatedAtUpdatedAtColumns(
    db.schema
      .createTable("grocery_item")
      .addColumn("id", "uuid", (col) =>
        col.primaryKey().defaultTo(sql`gen_random_uuid()`),
      )
      .addColumn("name", "varchar", (col) => col.notNull())
      .addColumn("store_id", "uuid", (col) =>
        col.references("store.id").notNull(),
      )
      .addColumn("price", "decimal", (col) => col.notNull())
      .addColumn("quantity", "float8", (col) => col.notNull())
      .addColumn("unit", "varchar", (col) => col.notNull())
      .addColumn("notes", "varchar")
      .addColumn("url", "varchar"),
  ).execute();
  // up migration code goes here...
  // note: up migrations are mandatory. you must implement this function.
  // For more info, see: https://kysely.dev/docs/migrations
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("grocery_item").execute();
  // down migration code goes here...
  // note: down migrations are optional. you can safely delete this function.
  // For more info, see: https://kysely.dev/docs/migrations
}
