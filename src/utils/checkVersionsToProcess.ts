import { eq } from "drizzle-orm";

import { db, versions } from "@db";

import { processVersion, type VersionURLSType } from "@/utils/precessVersion";

// Before importing any new version check if this is enabled to now overload the server.
export let IMPORTING = false;

export async function checkVersionsTopRocess() {
  if (process.env.AUTOIMPORTER == false || IMPORTING) return;

  IMPORTING = true;

  const data = await fetch("https://api.vintagestory.at/stable-unstable.json");
  const json: VersionsType = await data.json();

  const versionStrings = Object.keys(json).reverse();

  for (const version of versionStrings) {
    const [gameVersion] = await db
      .select()
      .from(versions)
      .where(eq(versions.version, version))
      .limit(1);

    if (gameVersion) continue;

    const winUrl = json[version]["windows"].urls.cdn ?? json[version]["windows"].urls.local;
    const linuxUrl = json[version]["linux"].urls.cdn ?? json[version]["linux"].urls.local;
    const macosUrl = json[version]["mac"].urls.cdn ?? json[version]["mac"].urls.local;

    if (!winUrl || !linuxUrl || !macosUrl) {
      console.log(`🔴 Couldn't get some of the URLS for the version v${version}!`);
      continue;
    }

    const urls: VersionURLSType = {
      win: winUrl,
      linux: linuxUrl,
      macos: macosUrl,
    };

    await processVersion(version, urls, Date.now());
  }
}
