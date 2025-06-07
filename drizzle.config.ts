import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schemas",
  dialect: "sqlite",
  casing: "snake_case",
  dbCredentials: {
    url: "file:/app/db/" + process.env.DB_FILE_NAME!,
  },
});
