import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST allowed" });

  const { apikey, ...readings } = req.body || {};
  const expectedApiKey = process.env.DEVICE_API_KEY;

  if (!expectedApiKey) {
    return res
      .status(500)
      .json({ error: "Server is not configured with DEVICE_API_KEY" });
  }

  if (apikey !== expectedApiKey) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  const sanitized = { ...readings, receivedAt: new Date().toISOString() };
  const filePath = path.join(process.cwd(), "public", "data", "latest.json");
  fs.writeFileSync(filePath, JSON.stringify(sanitized, null, 2));

  return res.status(200).json({ success: true });
}
