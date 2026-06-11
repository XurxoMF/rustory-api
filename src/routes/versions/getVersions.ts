import { type Context } from "hono";
import fse from "fs-extra";

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
          const macosArm64File = fse.existsSync(
            `/app/public/versions/macos/${version.version}.zip`,
          );

          return {
            version: version?.version,
            type: version?.type,
            releaseDate: version?.releaseDate,
            importedDate: version?.importedDate,
            windows: `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/windows/${version?.version}.zip`,
            windowsSha: version?.winSha,
            linux: `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/linux/${version?.version}.zip`,
            linuxSha: version?.linuxSha,
            macos: `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/macos/${version?.version}-X64.zip`,
            macosSha: version?.macX64Sha,
            macosX64: `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/macos/${version?.version}-X64.zip`,
            macosX64Sha: version?.macX64Sha,
            macosArm64: macosArm64File
              ? `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/macos/${version?.version}-ARM64.zip`
              : `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/macos/${version?.version}-X64.zip`,
            macosArm64Sha: version?.macArm64Sha,
          };
        }, 200),
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
    if (version === undefined) {
      c.json({ error: "Version not found" }, 404);
    } else {
      const [gameVersion] = await db
        .select()
        .from(versions)
        .where(eq(versions.version, version))
        .orderBy(desc(versions.releaseDate))
        .limit(1);

      if (!gameVersion) {
        return c.json({ error: "Version not found" }, 404);
      } else {
        const macosArm64File = fse.existsSync(
          `/app/public/versions/macos/${gameVersion.version}.zip`,
        );

        return c.json(
          {
            version: gameVersion.version,
            type: gameVersion.type,
            releaseDate: gameVersion.releaseDate,
            importedDate: gameVersion.importedDate,
            windows: `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/windows/${gameVersion.version}.zip`,
            windowsSha: gameVersion.winSha,
            linux: `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/linux/${gameVersion.version}.zip`,
            linuxSha: gameVersion.linuxSha,
            macos: `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/macos/${gameVersion.version}-X64.zip`,
            macosSha: gameVersion.macX64Sha,
            macosX64: `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/macos/${gameVersion.version}-X64.zip`,
            macosX64Sha: gameVersion.macX64Sha,
            macosArm64: macosArm64File
              ? `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/macos/${gameVersion.version}-ARM64.zip`
              : `${process.env.PROTOCOL}${process.env.DOMAIN}/files/versions/macos/${gameVersion.version}-X64.zip`,
            macosArm64Sha: gameVersion.macArm64Sha,
          },
          200,
        );
      }
    }
  } catch (error) {
    console.log("🔴 Error buscando el version:", error);
    return c.json({ error: "Error fetching version" }, 500);
  }
};
