import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";
import { serve } from "bun";
import * as dotenv from "dotenv";
import { resolve } from "path";
import fse from "fs-extra";

// ENV imports
dotenv.config({ path: "/app/.env" });

// Function imports
import { checkVersionsTopRocess } from "@/utils/checkVersionsToProcess";

// Route imports
import versionsRouter from "@/routes/versions";

import { startDClient } from "./discord";

const app = new Hono();

// Middleware
app.use(cors());

// Server favicon
app.use(
  "/favicon.ico",
  serveStatic({
    root: resolve(`/app/public`),
    rewriteRequestPath: (path) => path,
  }),
);

// Serve public files
app.use(
  "/files/*",
  serveStatic({
    root: resolve(`/app/public`),
    rewriteRequestPath: (path) => {
      return path.replace(/^\/files/, "");
    },
  }),
);

// Health check
app.get("/", (c) => {
  return c.json({ status: 200, message: "Rustory API OK" }, 200);
});

// Ruotes
app.route("/versions", versionsRouter);

// Check for new versions and import them if they are not added yet.
// Default 1 * 60 * 1000
setInterval(checkVersionsTopRocess, 1 * 60 * 1000);

// Initialize server
(async () => {
  try {
    console.log(`\n\n\n🟢 Starting API on ${process.env.PROTOCOL}${process.env.DOMAIN}!`);

    const files = fse.readdirSync("/app/public/files/versions/macos");

    if (files.some((file) => !file.endsWith("64.zip"))) {
      console.log("🟢 Renaming MacOS files to X64...");

      await Promise.all(
        files.map(async (file) => {
          if (file.endsWith(".zip")) {
            await fse.rename(
              `/app/public/files/versions/macos/${file}`,
              `/app/public/files/versions/macos/${file.replace(".zip", "-X64.zip")}`,
            );
          }
        }),
      );

      console.log("🟢 Renamned MacOS files to X64!");
    }

    await startDClient();

    serve({ fetch: app.fetch, port: 3000 });

    console.log(`🟢 Server running on ${process.env.PROTOCOL}${process.env.DOMAIN}!`);
  } catch (err) {
    console.error("🔴 Error starting API:", err);
  }
})();
