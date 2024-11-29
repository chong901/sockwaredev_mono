import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`.execute(db);

  await db.schema
    .createTable("city")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("country_code", "varchar", (col) => col.notNull())
    .addColumn("timezone", "varchar", (col) => col.notNull())
    .addColumn("modification_date", "date", (col) => col.notNull())
    .addColumn("admin1_code", "varchar")
    .addColumn("admin2_code", "varchar")
    .addColumn("admin3_code", "varchar")
    .addColumn("admin4_code", "varchar")
    .execute();

  await db.schema
    .createIndex("idx_city_name_country_code_admin_code_uniq")
    .on("city")
    .columns([
      "name",
      "country_code",
      "admin1_code",
      "admin2_code",
      "admin3_code",
      "admin4_code",
    ])
    .unique()
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex("idx_city_name_country_code_admin_code_uniq")
    .execute();
  await db.schema.dropTable("city").execute();
}
