import fs from "fs";
import path from "path";

function parseBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch (_) {
      return null;
    }
  }
  return null;
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST allowed" });
    return;
  }

  const parsedBody = parseBody(req);
  if (!parsedBody) {
    res.status(400).json({ error: "Invalid JSON" });
    return;
  }

  const apiKey = process.env.DEVICE_API_KEY || "growbox2025";
  const { apikey, ...readings } = parsedBody;

  if (apikey !== apiKey) {
    res.status(401).json({ error: "Invalid API key" });
    return;
  }

  const payload = {
    ...readings,
    receivedAt: new Date().toISOString(),
  };

  try {
    const filePath = path.join("/tmp", "latest.json");
    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to persist latest", details: String(err) });
  }
}
