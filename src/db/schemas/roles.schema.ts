import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

import { timestamps } from "../columns.helpers";

export const roles = sqliteTable("roles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  role: text("role").notNull().unique(),
  ...timestamps,
});
