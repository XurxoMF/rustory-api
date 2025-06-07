import { sqliteTable, integer, primaryKey } from "drizzle-orm/sqlite-core";

import { users } from "./users.schema";
import { roles } from "./roles.schema";

import { timestamps } from "../columns.helpers";

export const userRoles = sqliteTable(
  "user_roles",
  {
    userId: integer()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: integer()
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [primaryKey({ columns: [table.userId, table.roleId] })]
);
