const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join("/tmp", "config.json");
const API_KEY = "growbox2025";

module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Only POST allowed" }));
    return;
  }

  let body = "";
  req.on("data", (c) => (body += c.toString()));
  req.on("end", () => {
    try {
      const data = JSON.parse(body || "{}");

      if (data.apikey !== API_KEY) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Invalid API key" }));
        return;
      }

      if (typeof data.config !== "object" || data.config === null) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Missing 'config' object" }));
        return;
      }

      // Minimal-Check auf wichtige Felder (nur als grobe Absicherung)
      const cfg = data.config;

      // Optional: hier könnte man noch mehr validieren
      // z.B. range-checks, required fields etc.

      fs.writeFileSync(FILE_PATH, JSON.stringify(cfg, null, 2));

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true }));
    } catch (err) {
      res.statusCode = 400;
      res.end(
        JSON.stringify({ error: "Invalid JSON", details: String(err) })
      );
    }
  });
};
