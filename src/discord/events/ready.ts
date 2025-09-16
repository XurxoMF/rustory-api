import { Events, ActivityType } from "discord.js";
import { getDClient } from "@/discord";
import { type DReadyEventType } from "@/discord/discord.types";

const readyEvent: DReadyEventType = {
  name: Events.ClientReady,
  once: true,
  async execute() {
    const DClient = await getDClient();

    DClient.user?.setPresence({
      activities: [
        {
          name: `Rustory!`,
          type: ActivityType.Playing,
        },
      ],
    });
  },
};

export default readyEvent;
