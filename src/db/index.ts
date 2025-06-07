import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

import { users } from "./schemas/users.schema";
import { roles } from "./schemas/roles.schema";
import { userRoles } from "./schemas/user-roles.schema";
import { versions } from "./schemas/versions.schema";

const sqlite = new Database("/app/db/" + process.env.DB_FILE_NAME);
export const db = drizzle({ client: sqlite, casing: "snake_case" });

export { users, roles, userRoles, versions };
