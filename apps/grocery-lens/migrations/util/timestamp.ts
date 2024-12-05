import { CreateTableBuilder, sql } from "kysely";

export const withCreatedAtUpdatedAtColumns = (
  table: CreateTableBuilder<any, any>,
) => {
  return table
    .addColumn("created_at", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn("updated_at", "timestamptz", (col) => col.defaultTo(sql`now()`));
};
