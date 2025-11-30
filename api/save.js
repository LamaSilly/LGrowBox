import fs from "fs";
import path from "path";
import crypto from "crypto";

const TOKEN_SECRET = process.env.TOKEN_SECRET || "change-this-secret";

function verifyToken(token) {
  if (!token || typeof token !== "string") return false;

  const [body, signature] = token.split(".");
  if (!body || !signature) return false;

  const expectedSig = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(body)
    .digest("base64url");

  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSig);
  if (provided.length !== expected.length) {
    return false;
  }

  if (!crypto.timingSafeEqual(provided, expected)) {
    return false;
  }

  let payload;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch (e) {
    return false;
  }

  if (!payload.exp || Date.now() > payload.exp) {
    return false;
  }

  return true;
}

export default async function handler(req, res) {
  const { token, config } = req.body || {};

  if (!verifyToken(token)) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  if (!config || typeof config !== "object") {
    return res.status(400).json({ error: "Missing config payload" });
  }

  const filePath = path.join(process.cwd(), "public", "data", "config.json");
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2));

  res.status(200).json({ saved: true });
}
