const fs = require("fs");
const path = require("path");

const LOG_PATH = path.join("/tmp", "telemetry-log.json");

module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Only GET allowed" }));
    return;
  }

  try {
    if (!fs.existsSync(LOG_PATH)) {
      res.statusCode = 200;
      res.end(JSON.stringify([]));
      return;
    }

    const raw = fs.readFileSync(LOG_PATH, "utf8");
    const log = JSON.parse(raw);
    if (!Array.isArray(log)) {
      res.statusCode = 200;
      res.end(JSON.stringify([]));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify(log));
  } catch (err) {
    res.statusCode = 500;
    res.end(
      JSON.stringify({ error: "Failed to read history", details: String(err) })
    );
  }
};
