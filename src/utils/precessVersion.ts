import { EmbedBuilder, WebhookClient } from "discord.js";

import { db, versions } from "@db";

import { EMBED_COLORS, EMOJIS } from "@/discord/config.data";

import { downloadLinuxFile, downloadMacFile, downloadWindowsFile } from "@/utils/downloadManagers";
import { extractLinuxFile, extractMacFile, extractWindowsFile } from "@/utils/extractManagers";
import { compressLinuxFile, compressMacFile, compressWindowsFile } from "@/utils/compressManager";
import { deleteTmpFolder } from "@/utils/deleteManager";
import { generateSHA256 } from "@/utils/shaGeneratorManager";

export type VersionURLSType = { win: string; linux: string; macos: string };

export async function processVersion(
  version: string,
  urls: VersionURLSType,
  releaseDate: number
): Promise<boolean> {
  console.log(`💡 Downloading VS v${version}!`);

  let content = `<@&1375544976489844766> New VS Version available!`;
  let embedDesc = ``;

  const embed = new EmbedBuilder()
    .setTitle(`v${version} · IMPORTING...`)
    .setDescription(`${EMOJIS.LOADING} Preparing everything!`)
    .setColor(EMBED_COLORS.VSL)
    .setTimestamp(new Date());

  const webhook = new WebhookClient({ url: process.env.DISCORD_PUBLIC_UPDATES_WEBHOOK });
  const message = await webhook.send({ content, embeds: [embed] });

  try {
    // Download Windows file
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Downloading Windows file!`);
    await webhook.editMessage(message.id, { embeds: [embed] });
    const winFile = await downloadWindowsFile(version, urls.win);
    if (!winFile) throw new Error("❌ · Windows file failed to download!");
    embed.setDescription((embedDesc += `✅ · Windows file downloaded!\n`));
    await webhook.editMessage(message.id, { embeds: [embed] });

    // Download Linux file
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Downloading Linux file!`);
    await webhook.editMessage(message.id, { embeds: [embed] });
    const linuxFile = await downloadLinuxFile(version, urls.linux);
    if (!linuxFile) throw new Error("❌ · Linux file failed to download!");
    embed.setDescription((embedDesc += `✅ · Linux file downloaded!\n`));
    await webhook.editMessage(message.id, { embeds: [embed] });

    // Download MacOS file
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Downloading MacOS file!`);
    await webhook.editMessage(message.id, { embeds: [embed] });
    const macFile = await downloadMacFile(version, urls.macos);
    if (!macFile) throw new Error("❌ · MacOS file failed to download!");
    embed.setDescription((embedDesc += `✅ · MacOS file downloaded!\n`));
    await webhook.editMessage(message.id, { embeds: [embed] });

    // Extract Windows file
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Extracting Windows file!`);
    await webhook.editMessage(message.id, { embeds: [embed] });
    const winOut = await extractWindowsFile(version, winFile);
    if (!winOut) throw new Error("❌ · Windows file failed to extract!");
    embed.setDescription((embedDesc += `✅ · Windows file extracted!\n`));
    await webhook.editMessage(message.id, { embeds: [embed] });

    // Extract Linux file
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Extracting Linux file!`);
    await webhook.editMessage(message.id, { embeds: [embed] });
    const linuxOut = await extractLinuxFile(version, linuxFile);
    if (!linuxOut) throw new Error("❌ · Linux file failed to extract!");
    embed.setDescription((embedDesc += `✅ · Linux file extracted!\n`));
    await webhook.editMessage(message.id, { embeds: [embed] });

    // Extract MacOS file
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Extracting MacOS file!`);
    await webhook.editMessage(message.id, { embeds: [embed] });
    const macOut = await extractMacFile(version, macFile);
    if (!macOut) throw new Error("❌ · MacOS file failed to extract!");
    embed.setDescription((embedDesc += `✅ · MacOS file extracted!\n`));
    await webhook.editMessage(message.id, { embeds: [embed] });

    // Compress Windows file
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Compressing Windows VS Version!`);
    await webhook.editMessage(message.id, { embeds: [embed] });
    const winZip = await compressWindowsFile(version, winOut);
    if (!winZip) throw new Error("❌ · Windows VS Version failed to compress!");
    embed.setDescription((embedDesc += `✅ · Windows VS Version compressed!\n`));
    await webhook.editMessage(message.id, { embeds: [embed] });

    // Compress Linux file
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Compressing Linux VS Version!`);
    await webhook.editMessage(message.id, { embeds: [embed] });
    const linuxZip = await compressLinuxFile(version, linuxOut);
    if (!linuxZip) throw new Error("❌ · Linux VS Version failed to compress!");
    embed.setDescription((embedDesc += `✅ · Linux VS Version compressed!\n`));
    await webhook.editMessage(message.id, { embeds: [embed] });

    // Compress MacOS file
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Compressing MacOS VS Version!`);
    await webhook.editMessage(message.id, { embeds: [embed] });
    const macZip = await compressMacFile(version, macOut);
    if (!macZip) throw new Error("❌ · MacOS VS Version failed to compress!");
    embed.setDescription((embedDesc += `✅ · MacOS VS Version compressed!\n`));
    await webhook.editMessage(message.id, { embeds: [embed] });

    // Generate Windows SHA256
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Generating Windows SHA256!`);
    await webhook.editMessage(message.id, { embeds: [embed] });
    const winSha = await generateSHA256(winZip);
    if (!winSha) throw new Error("❌ · Windows SHA256 could not be generated!");
    embed.setDescription((embedDesc += `✅ · Windows SHA256 generated!\n`));
    await webhook.editMessage(message.id, { embeds: [embed] });

    // Generate Linux SHA256
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Generating Linux SHA256!`);
    await webhook.editMessage(message.id, { embeds: [embed] });
    const linuxSha = await generateSHA256(linuxZip);
    if (!linuxSha) throw new Error("❌ · Linux SHA256 could not be generated!");
    embed.setDescription((embedDesc += `✅ · Linux SHA256 generated!\n`));
    await webhook.editMessage(message.id, { embeds: [embed] });

    // Generate MacOS SHA256
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Generating MacOS SHA256!`);
    await webhook.editMessage(message.id, { embeds: [embed] });
    const macSha = await generateSHA256(macZip);
    if (!macSha) throw new Error("❌ · MacOS SHA256 could not be generated!");
    embed.setDescription((embedDesc += `✅ · MacOS SHA256 generated!\n`));
    await webhook.editMessage(message.id, { embeds: [embed] });

    // Add VS Versions to the DB
    embed.setDescription(embedDesc + `${EMOJIS.LOADING} Saving VS Versions on the database!`);
    await webhook.editMessage(message.id, { embeds: [embed] });

    // Get the type of the version. "stable", "rc" or "pre"
    let type: string;
    const versionParts = version.split("-");

    if (versionParts.length < 2) {
      type = "stable";
    } else {
      const subVersionParts = versionParts[1].split(".");
      if (subVersionParts.length < 1) {
        type = "stable";
      } else {
        type = subVersionParts[0];
      }
    }

    await db.insert(versions).values({
      version,
      type,
      releaseDate,
      importedDate: Date.now(),
      winSha,
      linuxSha,
      macSha,
    });

    embed.setDescription(
      (embedDesc += `✅ · VS Version saved!\n\nYou can now download it on Rustory!`)
    );
    await webhook.editMessage(message.id, { embeds: [embed] });
  } catch (err: any) {
    console.log(err);

    embed.setDescription((embedDesc += `❌ · There was an error importing this version!`));
    await webhook.editMessage(message.id, { embeds: [embed] });

    const tmpDeleted = await deleteTmpFolder();
    if (!tmpDeleted) console.log("🔴 /app/tmp folder couldn't be deleted!");

    return false;
  } finally {
    console.log(`🟢 VS v${version} added successfully!`);

    const tmpDeleted = await deleteTmpFolder();
    if (!tmpDeleted) console.log("🔴 /app/tmp folder couldn't be deleted!");

    return true;
  }
}
