import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

import { timestamps } from "../columns.helpers";

export const users = sqliteTable("users", {
  id: integer().primaryKey({ autoIncrement: true }),
  discordId: text().notNull().unique(),
  ...timestamps,
});
