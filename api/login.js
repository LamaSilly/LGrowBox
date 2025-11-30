import crypto from "crypto";

const PASSWORD_HASH = crypto
  .createHash("sha256")
  .update("488248")
  .digest("hex");

const TOKEN_SECRET = process.env.TOKEN_SECRET || "change-this-secret";
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function signToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(body)
    .digest("base64url");

  return `${body}.${signature}`;
}

export default async function handler(req, res) {
  const { password } = req.body || {};
  const hash = crypto.createHash("sha256").update(password).digest("hex");

  if (hash !== PASSWORD_HASH) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const token = signToken({ exp: expiresAt });
  return res.status(200).json({ token, expiresAt });
}
