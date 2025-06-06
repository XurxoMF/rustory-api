import { type Context } from "hono";

import { db, versions } from "@db";
import { desc, eq } from "drizzle-orm";

export const getVersions = async (c: Context) => {
  try {
    const gameVersions = await db.select().from(versions).orderBy(desc(versions.releaseDate));

    if (!gameVersions) {
      return c.json({ error: "No versions found" }, 404);
    } else {
      return c.json(
        gameVersions.map((version) => {
          return {
            version: version?.version,
            type: version?.type,
            releaseDate: version?.releaseDate,
            importedDate: version?.importedDate,
            windows: `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/windows/${version?.version}.zip`,
            windowsSha: version?.winSha,
            linux: `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/linux/${version?.version}.zip`,
            linuxSha: version?.linuxSha,
            macos: `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/macos/${version?.version}.zip`,
            macosSha: version?.macSha,
          };
        }, 200)
      );
    }
  } catch (error) {
    console.log("🔴 Error al buscar versions:", error);
    return c.json({ error: "Error fetching versions" }, 500);
  }
};

export const getVersionByVersion = async (c: Context) => {
  const version = c.req.param("version");

  try {
    const [gameVersion] = await db
      .select()
      .from(versions)
      .where(eq(versions.version, version))
      .orderBy(desc(versions.releaseDate))
      .limit(1);

    if (!gameVersion) {
      return c.json({ error: "Version not found" }, 404);
    } else {
      return c.json(
        {
          version: gameVersion?.version,
          type: gameVersion?.type,
          releaseDate: gameVersion?.releaseDate,
          importedDate: gameVersion?.importedDate,
          windows: `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/windows/${gameVersion?.version}.zip`,
          windowsSha: gameVersion?.winSha,
          linux: `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/linux/${gameVersion?.version}.zip`,
          linuxSha: gameVersion?.linuxSha,
          macos: `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/macos/${gameVersion?.version}.zip`,
          macosSha: gameVersion?.macSha,
        },
        200
      );
    }
  } catch (error) {
    console.log("🔴 Error buscando el version:", error);
    return c.json({ error: "Error fetching version" }, 500);
  }
};
