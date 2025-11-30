import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const { token, config } = req.body || {};

  if (!token) return res.status(401).json({ error: "Missing token" });

  if (token.length < 30) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const filePath = path.join(process.cwd(), "data", "config.json");

  fs.writeFileSync(filePath, JSON.stringify(config, null, 2));

  res.status(200).json({ saved: true });
}
