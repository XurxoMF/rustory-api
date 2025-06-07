import { Client, Collection, GatewayIntentBits } from "discord.js";
import {
  type DCommandChatInputType,
  type DCommandMessageContextMenuType,
  type DCommandUserContextMenuType,
} from "@/discord/discord.types";

/**
 * Extended Discord Client with more functionality.
 *
 * @export
 * @class DClient
 * @extends {Client}
 */
export default class DClientClass extends Client {
  cooldowns!: Collection<any, any>;
  comandosChatImput!: Collection<string, DCommandChatInputType>;
  comandosMessageContextMenu!: Collection<string, DCommandMessageContextMenuType>;
  comandosUserContextMenu!: Collection<string, DCommandUserContextMenuType>;

  constructor(
    intents: { intents: GatewayIntentBits[] },
    cooldowns: Collection<any, any>,
    comandosChatImput: Collection<string, DCommandChatInputType>,
    comandosMessageContextMenu: Collection<string, DCommandMessageContextMenuType>,
    comandosUserContextMenu: Collection<string, DCommandUserContextMenuType>
  ) {
    super(intents);
    this.cooldowns = cooldowns;
    this.comandosChatImput = comandosChatImput;
    this.comandosMessageContextMenu = comandosMessageContextMenu;
    this.comandosUserContextMenu = comandosUserContextMenu;
  }
}
