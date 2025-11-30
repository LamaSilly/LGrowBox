const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join("/tmp", "config.json");

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

      if (data.apikey !== "growbox2025") {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Invalid API key" }));
        return;
      }

      if (typeof data.config !== "object") {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Missing 'config' object" }));
        return;
      }

      fs.writeFileSync(FILE_PATH, JSON.stringify(data.config, null, 2));

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
