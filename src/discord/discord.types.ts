import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
  SlashCommandBuilder,
  UserContextMenuCommandInteraction
} from "discord.js"

export enum DCommandTypes {
  ChatInput,
  MessageContextMenu,
  UserContextMenu
}

export type DCommandBase = {
  type: DCommandTypes
  data: OptionalExceptFor<SlashCommandBuilder, "name"> | OptionalExceptFor<ContextMenuCommandBuilder, "name">
  execute: any
}

export type DCommandChatInput = DCommandBase & {
  cooldown?: number
  data: OptionalExceptFor<SlashCommandBuilder, "name">
  autocomplete?: (interaction: AutocompleteInteraction) => void
  execute: (interaction: ChatInputCommandInteraction) => void
}

export type DCommandMessageContextMenu = DCommandBase & {
  data: OptionalExceptFor<ContextMenuCommandBuilder, "name">
  execute: (interaction: MessageContextMenuCommandInteraction) => void
}

export type DCommandUserContextMenu = DCommandBase & {
  data: OptionalExceptFor<ContextMenuCommandBuilder, "name">
  execute: (interaction: UserContextMenuCommandInteraction) => void
}

export type DBaseEventType = {
  name: string
  once?: boolean
  execute: any
}

export type DReadyEventType = DBaseEventType & {
  execute: () => void
}

export type DInteractionCreateEventType = DBaseEventType & {
  execute: (interaction: any) => void
}
