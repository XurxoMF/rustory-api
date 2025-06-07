import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

import { timestamps } from "../columns.helpers";

export const versions = sqliteTable("versions", {
  id: integer().primaryKey({ autoIncrement: true }),
  version: text().notNull().unique(),
  type: text().notNull(),
  releaseDate: integer().notNull(),
  importedDate: integer().notNull(),
  winSha: text().notNull(),
  linuxSha: text().notNull(),
  macSha: text().notNull(),
  ...timestamps,
});
