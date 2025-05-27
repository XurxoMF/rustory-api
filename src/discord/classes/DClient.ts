import { Client, Collection, GatewayIntentBits } from "discord.js"
import { DCommandChatInput, DCommandMessageContextMenu, DCommandUserContextMenu } from "@/discord/discord.types"

/**
 * Extended Discord Client with more functionality.
 *
 * @export
 * @class DClient
 * @extends {Client}
 */
export default class DClientClass extends Client {
  cooldowns!: Collection<any, any>
  comandosChatImput!: Collection<string, DCommandChatInput>
  comandosMessageContextMenu!: Collection<string, DCommandMessageContextMenu>
  comandosUserContextMenu!: Collection<string, DCommandUserContextMenu>

  constructor(
    intents: { intents: GatewayIntentBits[] },
    cooldowns: Collection<any, any>,
    comandosChatImput: Collection<string, DCommandChatInput>,
    comandosMessageContextMenu: Collection<string, DCommandMessageContextMenu>,
    comandosUserContextMenu: Collection<string, DCommandUserContextMenu>
  ) {
    super(intents)
    this.cooldowns = cooldowns
    this.comandosChatImput = comandosChatImput
    this.comandosMessageContextMenu = comandosMessageContextMenu
    this.comandosUserContextMenu = comandosUserContextMenu
  }
}
