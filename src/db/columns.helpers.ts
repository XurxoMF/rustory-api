import { integer } from "drizzle-orm/sqlite-core";

export const timestamps = {
  updatedAt: integer({ mode: "timestamp" }).notNull().default(new Date()),
  createdAt: integer({ mode: "timestamp" }).notNull().default(new Date()),
};
