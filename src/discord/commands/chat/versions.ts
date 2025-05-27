import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js"
import { DCommandChatInput, DCommandTypes } from "@/discord/discord.types"
import { ADS } from "@db"
import { Versions } from "@repos"

const command: DCommandChatInput = {
  type: DCommandTypes.ChatInput,
  cooldown: 10,
  data: new SlashCommandBuilder().setName("vs-versions").setDescription("Lists the available downloadable versions."),
  async execute(interaction: ChatInputCommandInteraction) {
    const gameVersionsRepo = ADS.getRepository(Versions)

    const gameVersions = await gameVersionsRepo.find({ order: { releaseDate: "DESC" } })

    let res = `## Available VS Versions`

    let versions: string[] = []
    let latest: string | undefined

    for (const gv of gameVersions) {
      const ver = gv.version.split(".").slice(0, 2).join(".")
      if (!latest) latest = ver

      if (latest !== ver) {
        res += `\n- `
        res += versions.join(" · ")
        versions = []
      }

      versions.push(`\`${gv.version}\``)
      latest = ver
    }

    if (versions.length > 0) {
      res += `\n- `
      res += versions.join(" · ")
    }

    interaction.reply({ content: res })
  },
}

export default command
