import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { type DCommandChatInputType, DCommandTypes } from "@/discord/discord.types";

import { db, versions as versions } from "@db";
import { desc } from "drizzle-orm";

const command: DCommandChatInputType = {
  type: DCommandTypes.ChatInput,
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("vs-versions")
    .setDescription("Lists the available downloadable versions."),
  async execute(interaction: ChatInputCommandInteraction) {
    const gameVersions = await db.select().from(versions).orderBy(desc(versions.releaseDate));

    let res = `## Available VS Versions`;

    let gameVersionsStrings: string[] = [];
    let latest: string | undefined;

    for (const gv of gameVersions) {
      const ver = gv.version.split(".").slice(0, 2).join(".");
      if (!latest) latest = ver;

      if (latest !== ver) {
        res += `\n- `;
        res += gameVersionsStrings.join(" · ");
        gameVersionsStrings = [];
      }

      gameVersionsStrings.push(`\`${gv.version}\``);
      latest = ver;
    }

    if (gameVersionsStrings.length > 0) {
      res += `\n- `;
      res += gameVersionsStrings.join(" · ");
    }

    interaction.reply({ content: res });
  },
};

export default command;
