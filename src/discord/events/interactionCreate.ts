import { Events, Collection, BaseInteraction } from "discord.js"
import { BASE_COOLDOWN } from "@/discord/config.data"
import { getDClient } from "@/discord"
import DClientClass from "@/discord/classes/DClient"
import { DInteractionCreateEventType } from "@/discord/discord.types"

const interationCreateEvent: DInteractionCreateEventType = {
  name: Events.InteractionCreate,
  async execute(interaction: BaseInteraction) {
    const DClient = await getDClient()

    if (interaction.isAutocomplete()) {
      const command = DClient.comandosChatImput.get(interaction.commandName)
      if (command && command.autocomplete) {
        try {
          command.autocomplete(interaction)
        } catch (error) {
          console.error(error)
        }
      } else {
        console.error(`No command matching ${interaction.commandName} was found.`)
      }
      return
    }

    // If the bot in in maintenance mode only allow DEV user interactions.
    if (interaction.isChatInputCommand() || interaction.isMessageContextMenuCommand() || interaction.isUserContextMenuCommand()) {
      if (process.env.DEV_DMODE && interaction.user.id !== process.env.DEV_DID) {
        return interaction.reply({
          content: `> <@${interaction.user.id}> Bot in maintenance mode! Wait a few minutes!`,
          flags: ["Ephemeral"]
        })
      }
    }

    if (interaction.isChatInputCommand()) {
      const commandChatInput = DClient.comandosChatImput.get(interaction.commandName)

      if (!commandChatInput) {
        return interaction.reply({
          content: `Command ${interaction.commandName} doesn't exists!`,
          flags: ["Ephemeral"]
        })
      }

      // COOLDOWNS
      const isInCooldwn = await checkIsInCooldown(DClient, commandChatInput.data.name, interaction.user.id, commandChatInput.cooldown)

      if (isInCooldwn !== -1) {
        const expiredTimestamp = Math.round(isInCooldwn / 1000)
        return interaction.reply({
          content: `That command in in cooldown! You in can use it again <t:${expiredTimestamp}:R>.`,
          flags: ["Ephemeral"]
        })
      }
      // END COOLDOWNS

      try {
        commandChatInput.execute(interaction)
      } catch (error) {
        console.error(error)
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error executing that command!",
            flags: ["Ephemeral"]
          })
        } else {
          await interaction.reply({
            content: "There was an error executing that command!",
            flags: ["Ephemeral"]
          })
        }
      }
    } else if (interaction.isMessageContextMenuCommand()) {
      const commandMessageContextMenu = DClient.comandosMessageContextMenu.get(interaction.commandName)

      if (!commandMessageContextMenu) {
        return interaction.reply({
          content: `Command ${interaction.commandName} doesn't exists!`,
          flags: ["Ephemeral"]
        })
      }

      try {
        commandMessageContextMenu.execute(interaction)
      } catch (error) {
        console.error(error)
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error executing that command!",
            flags: ["Ephemeral"]
          })
        } else {
          await interaction.reply({
            content: "There was an error executing that command!",
            flags: ["Ephemeral"]
          })
        }
      }
    } else if (interaction.isUserContextMenuCommand()) {
      const commandUserContextMenu = DClient.comandosUserContextMenu.get(interaction.commandName)

      if (!commandUserContextMenu) {
        return interaction.reply({
          content: `Command ${interaction.commandName} doesn't exists!`,
          flags: ["Ephemeral"]
        })
      }

      try {
        commandUserContextMenu.execute(interaction)
      } catch (error) {
        console.error(error)
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error executing that command!",
            flags: ["Ephemeral"]
          })
        } else {
          await interaction.reply({
            content: "There was an error executing that command!",
            flags: ["Ephemeral"]
          })
        }
      }
    }

    return
  }
}

export default interationCreateEvent

/**
 * Checks if the command is in cooldown.
 * If it's in cooldown, returns the expiration date in ms.
 * If it's not, returns -1
 *
 * @param {string} command Command name to register the cooldown.
 * @param {number} cooldown Cooldown to apply if it's not in cooldown already.
 * @return {Promise<number>} -1 if it's not in cooldown, date in ms when the command can be used again.
 */
async function checkIsInCooldown(client: DClientClass, command: string, userId: string, cooldown?: number): Promise<number> {
  const cooldowns = client.cooldowns

  if (!cooldowns.has(command)) {
    cooldowns.set(command, new Collection())
  }

  const now = Date.now()
  const timestamps = cooldowns.get(command)
  const defaultCooldownDuration = BASE_COOLDOWN
  const cooldownAmount = (cooldown || defaultCooldownDuration) * 1000

  if (timestamps.has(userId)) {
    const expirationTime = timestamps.get(userId) + cooldownAmount || 0
    if (now < expirationTime) return expirationTime
  }

  timestamps.set(userId, now)
  setTimeout(() => timestamps.delete(userId), cooldownAmount)

  return -1
}
