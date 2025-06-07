import { ChatInputCommandInteraction } from "discord.js";
import { getDClient } from "@/discord";
import { type DCommandChatInputType, DCommandTypes } from "@/discord/discord.types";
import { data } from "./ping.data";

const command: DCommandChatInputType = {
  type: DCommandTypes.ChatInput,
  cooldown: 10,
  data,
  async execute(interaction: ChatInputCommandInteraction) {
    const DClient = await getDClient();

    await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const ping = reply.createdTimestamp - interaction.createdTimestamp;

    interaction.editReply(
      `> **Pong!** *Client \`${ping}ms\`* · *Websocket: \`${DClient.ws.ping}ms\`*`
    );
  },
};

export default command;
