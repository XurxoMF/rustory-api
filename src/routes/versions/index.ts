import { Hono } from "hono"
import { getVersionByVersion, getVersions } from "./getVersions"

const router = new Hono()

router.get("/", getVersions)
router.get("/:version", getVersionByVersion)

export default router
