import axios from "axios"
import { Context } from "hono"
import { JwtPayload, sign, verify } from "jsonwebtoken"

export const authDiscord = (c: Context) => {
  const url = new URL("https://discord.com/oauth2/authorize")
  url.searchParams.set("client_id", process.env.DISCORD_CLIENT_ID)
  url.searchParams.set("redirect_uri", process.env.DISCORD_REDIRECT_URL)
  url.searchParams.set("response_type", "code")
  url.searchParams.set("scope", "identify email")
  return c.redirect(url.toString())
}

export const authDiscordCallback = async (c: Context) => {
  const code = c.req.query("code")

  if (!code) return c.json({ message: "Something went wrong while autenticating!" }, 400)

  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.DISCORD_REDIRECT_URL,
  })

  const tokenRes = await axios.post("https://discord.com/api/oauth2/token", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  })

  const { access_token } = tokenRes.data

  const userRes = await axios.get("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${access_token}` },
  })

  const user = userRes.data

  const jwtPayload = {
    id: user.id,
    username: user.username,
    avatar: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/0.png`,
  }

  const accessToken = sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "1h" })
  const refreshToken = sign({ id: user.id }, process.env.REFRESH_SECRET, { expiresIn: "7d" })

  return c.json({ accessToken, refreshToken, user: jwtPayload })
}

export const refreshJWT = async (c: Context) => {
  const body = await c.req.json()
  const { refreshToken } = body

  if (!refreshToken) return c.json({ message: "No refreshToken provided!" }, 400)

  try {
    const payload = verify(refreshToken, process.env.REFRESH_SECRET) as JwtPayload

    const newAccessToken = sign({ id: payload.id }, process.env.JWT_SECRET, { expiresIn: "1h" })

    return c.json({ accessToken: newAccessToken })
  } catch (err) {
    return c.json({ message: "Invalid or expired refreshToken!" }, 401)
  }
}

export const logout = async (c: Context) => {
  return c.json({ message: "Logged out!" })
}
