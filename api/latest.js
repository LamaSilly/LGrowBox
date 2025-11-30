import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join("/tmp", "latest.json");
  res.setHeader("Content-Type", "application/json");

  if (!fs.existsSync(filePath)) {
    res.status(200).end(JSON.stringify({ error: "No data yet" }));
    return;
  }

  try {
    const data = fs.readFileSync(filePath, "utf8");
    res.status(200).end(data);
  } catch (err) {
    res.status(500).end(
      JSON.stringify({ error: "Failed to read latest", details: String(err) })
    );
  }
}
