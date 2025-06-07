import { Hono } from "hono";
import { authDiscord, authDiscordCallback, getUserData, logout, refreshJWT } from "./auth";

const router = new Hono();

router.get("/discord", authDiscord);
router.get("/discord/callback", authDiscordCallback);
router.post("/discord/refresh", refreshJWT);
router.post("/discord/logout", logout);
router.get("/discord/data", getUserData);

export default router;
