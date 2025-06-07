import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("vs-versions")
  .setDescription("Lists the available downloadable versions.");
