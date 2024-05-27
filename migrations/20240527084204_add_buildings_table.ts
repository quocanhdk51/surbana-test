import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("buildings", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("key").notNullable().unique();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("buildings");
}
