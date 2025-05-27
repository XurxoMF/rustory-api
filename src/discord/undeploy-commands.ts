import { REST, Routes } from "discord.js"
import * as dotenv from "dotenv"

dotenv.config({ path: "/app/.env" })

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN)

// Deletion of all the app commands
;(async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(process.env.DISCORD_APP_ID, process.env.DISCORD_GUILD_ID), {
      body: []
    })
    console.log(`🟢 Successfully deleted all the app commands!`)
  } catch (error) {
    console.log(`🔴 There was an error deleting the app commands!`)
    console.error(error)
  }
})()
