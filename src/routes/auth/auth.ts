import { db, roles, userRoles, users } from "@/db";
import axios from "axios";
import { eq } from "drizzle-orm";
import { type Context } from "hono";
import { decode, type JwtPayload, sign, verify } from "jsonwebtoken";

export const authDiscord = (c: Context) => {
  const redirect_uri = c.req.query("redirect_uri");
  if (!redirect_uri) return c.json({ error: "Missing redirect_uri" }, 400);

  const url = new URL("https://discord.com/oauth2/authorize");
  url.searchParams.set("client_id", process.env.DISCORD_CLIENT_ID);
  url.searchParams.set("redirect_uri", process.env.DISCORD_REDIRECT_URL);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "identify email");
  url.searchParams.set("state", redirect_uri);
  return c.redirect(url.toString());
};

export const authDiscordCallback = async (c: Context) => {
  const code = c.req.query("code");
  // This state is the redirect_uri where the user needs the tokens.
  // We set it on the authDiscord() function above.
  const state = c.req.query("state");

  if (!code || !state) return c.json({ error: "Something went wrong while autenticating!" }, 400);

  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.DISCORD_REDIRECT_URL,
  });

  const tokenRes = await axios.post("https://discord.com/api/oauth2/token", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const { access_token } = tokenRes.data;

  if (!access_token) return c.json({ error: "Auith failed!" }, 401);

  const userRes = await axios.get("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  const user = userRes.data;

  const jwtPayload: DiscordUserType = {
    id: user.id,
    username: user.username,
    avatar: user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/0.png`,
  };

  try {
    const dbMatchingUsers = await db.$count(users, eq(users.discordId, user.id));

    if (dbMatchingUsers === 0) {
      const [createdUser] = await db
        .insert(users)
        .values({
          discordId: jwtPayload.id,
        })
        .returning();

      await db.insert(userRoles).values({
        userId: createdUser.id,
        roleId: 1,
      });
    }
  } catch (e) {
    console.error("Error while inserting user into the database:", JSON.stringify(e));
    return c.json({ error: "Internal server error" }, 500);
  }

  const accessToken = sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "1h" });
  const refreshToken = sign(jwtPayload, process.env.REFRESH_SECRET, { expiresIn: "30d" });

  if (state.startsWith("https://") || state.startsWith("http://")) {
    return c.html(
      `<!doctypehtml><html lang="en"><meta charset="UTF-8"><meta content="width=device-width,initial-scale=1"name="viewport"><link href="https://fonts.googleapis.com/css?family=Ubuntu:400,500,700&display=swap"rel="stylesheet"><title>You're now logged in!</title><div class="container"><h1>You're now logged in!</h1><p>This page should be closed automatically. If don't, feel free to close it manually!</div><style>*{box-sizing:border-box;padding:0;margin:0}body{width:100dvw;height:100dvh;background-color:#18181b;color:#f4f4f5;font-family:Ubuntu,"Courier New",Courier,monospace;display:flex;align-items:center;justify-content:center}.container{width:100%;max-width:60rem;text-align:center;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:1rem}</style><script>if (window.opener) {window.opener.postMessage(${JSON.stringify(
        { accessToken, refreshToken }
      )}, "${
        new URL(state).origin
      }");} else {window.location = '${state}?accessToken=${accessToken}&refreshToken=${refreshToken}';}</script>`
    );
  } else {
    return c.html(`<!doctypehtml><html lang="en"><meta charset="UTF-8"><meta content="width=device-width,initial-scale=1"name="viewport"><link href="https://fonts.googleapis.com/css?family=Ubuntu:400,500,700&display=swap"rel="stylesheet"><title>You're now logged in!</title><div class="container"><h1>You're now logged in!</h1><p>This page should be closed automatically. If don't, feel free to close it manually!</div><style>*{box-sizing:border-box;padding:0;margin:0}body{width:100dvw;height:100dvh;background-color:#18181b;color:#f4f4f5;font-family:Ubuntu,"Courier New",Courier,monospace;display:flex;align-items:center;justify-content:center}.container{width:100%;max-width:60rem;text-align:center;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:1rem}</style><script>window.location = "${state}?accessToken=${accessToken}&refreshToken=${refreshToken}"
    setTimeout(() => window.close(), 5_000)</script>`);
  }
};

export const refreshJWT = async (c: Context) => {
  const body = await c.req.json();
  const { refreshToken } = body;

  if (!refreshToken) return c.json({ error: "No refreshToken provided!" }, 400);

  try {
    const payload = verify(refreshToken, process.env.REFRESH_SECRET) as DiscordUserType;

    const jwtPayload: DiscordUserType = {
      id: payload.id,
      username: payload.username,
      avatar: payload.avatar,
    };

    const newAccessToken = sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

    return c.json({ accessToken: newAccessToken });
  } catch (err) {
    console.log("Error while verifying refreshToken:", JSON.stringify(err));
    return c.json({ error: "Invalid or expired refreshToken!" }, 401);
  }
};

export const logout = async (c: Context) => {
  return c.json({ message: "Logged out!" }, 200);
};

export const getUserData = async (c: Context) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return c.json({ error: "Unauthorized" }, 401);

  const accessToken = authHeader.split(" ")[1];

  try {
    const payload = verify(accessToken, process.env.JWT_SECRET) as DiscordUserType;

    if (!payload || !payload.id) return c.json({ error: "Unautorized!" }, 401);

    const userWithRoles = await db
      .select({
        id: users.id,
        discordId: users.discordId,
        role: roles.role,
      })
      .from(users)
      .innerJoin(userRoles, eq(users.id, userRoles.userId))
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(users.discordId, payload.id));

    if (userWithRoles.length < 1) return c.json({ error: "User not found!" }, 400);

    const user = {
      id: userWithRoles[0].discordId,
      username: payload.username,
      avatar: payload.avatar,
      roles: userWithRoles.map((u) => u.role),
    };

    return c.json(user, 200);
  } catch (e) {
    console.error("Error while verifying JWT:", JSON.stringify(e));
    return c.json({ error: "Internal server error" }, 500);
  }
};

export type DiscordUserType = {
  id: string;
  username: string;
  avatar: string;
};
