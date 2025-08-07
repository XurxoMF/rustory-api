import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";
import { serve } from "bun";
import * as dotenv from "dotenv";
import { resolve } from "path";

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
    root: resolve(__dirname, `/app/public`),
    rewriteRequestPath: (path) => path,
  })
);

// Serve public files
app.use(
  "/files/*",
  serveStatic({
    root: resolve(__dirname, `/app/public`),
    rewriteRequestPath: (path) => path,
  })
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
    await startDClient();

    serve({ fetch: app.fetch, port: 3000 });
    console.log(`🟢 Server running on ${process.env.PROTOCOL}${process.env.DOMAIN}!`);
  } catch (err) {
    console.error("🔴 Error starting API:", err);
  }
})();
