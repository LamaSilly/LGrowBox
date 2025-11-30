import crypto from "crypto";

const PASSWORD_HASH = crypto
  .createHash("sha256")
  .update("488248")
  .digest("hex");

export default async function handler(req, res) {
  const { password } = req.body || {};
  const hash = crypto.createHash("sha256").update(password).digest("hex");

  if (hash !== PASSWORD_HASH) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  return res.status(200).json({ token });
}
