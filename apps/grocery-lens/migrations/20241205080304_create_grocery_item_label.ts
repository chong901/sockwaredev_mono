import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("grocery_item_label")
    .addColumn("grocery_item_id", "uuid", (col) => col.references("grocery_item.id").notNull())
    .addColumn("label_id", "uuid", (col) => col.references("label.id").notNull())
    .execute();

  await db.schema.createIndex("grocery_item_label_grocery_item_id_label_id_uniq").on("grocery_item_label").columns(["grocery_item_id", "label_id"]).unique().execute();
  // up migration code goes here...
  // note: up migrations are mandatory. you must implement this function.
  // For more info, see: https://kysely.dev/docs/migrations
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex("grocery_item_label_grocery_item_id_label_id_uniq").execute();
  await db.schema.dropTable("grocery_item_label").execute();
  // down migration code goes here...
  // note: down migrations are optional. you can safely delete this function.
  // For more info, see: https://kysely.dev/docs/migrations
}
