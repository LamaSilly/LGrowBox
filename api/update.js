import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  const { apikey } = req.body;

  if (apikey !== "growbox2025") {
    return res.status(401).json({ error: "Invalid API key" });
  }

  const filePath = path.join(process.cwd(), "data", "latest.json");

  fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));

  return res.status(200).json({ success: true });
}
