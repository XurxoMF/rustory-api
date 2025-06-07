declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DOMAIN: string;
      PROTOCOL: string;
      DB_FILE_NAME: string;
      AUTOIMPORTER: boolean;
      JWT_SECRET: string;
      REFRESH_SECRET: string;
      DISCORD_CLIENT_ID: string;
      DISCORD_CLIENT_SECRET: string;
      DISCORD_REDIRECT_URL: string;
      DISCORD_BOT_TOKEN: string;
      DISCORD_GUILD_ID: string;
      DISCORD_DEV_MODE: boolean;
      DISCORD_DEV_ID: string;
      DISCORD_PRIV_UPDATES_WEBHOOK: string;
      DISCORD_PUBLIC_UPDATES_WEBHOOK: string;
    }
  }
}

export {};
