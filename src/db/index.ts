import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

import { versions } from "./schemas/versions.schema";

const sqlite = new Database("/app/db/" + process.env.DB_FILE_NAME);
export const db = drizzle({ client: sqlite, casing: "snake_case" });

export { versions };
