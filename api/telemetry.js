const fs = require("fs");
const path = require("path");

const LATEST_PATH = path.join("/tmp", "latest.json");
const LOG_PATH = path.join("/tmp", "telemetry-log.json");

const API_KEY = "growbox2025";
const MAX_LOG_ENTRIES = 300;

function appendToLog(entry) {
  let log = [];
  try {
    if (fs.existsSync(LOG_PATH)) {
      const raw = fs.readFileSync(LOG_PATH, "utf8");
      log = JSON.parse(raw);
      if (!Array.isArray(log)) log = [];
    }
  } catch {
    log = [];
  }

  log.push(entry);
  if (log.length > MAX_LOG_ENTRIES) {
    log = log.slice(log.length - MAX_LOG_ENTRIES);
  }

  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2));
}

module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");

  // ESP sendet die Daten
  if (req.method === "POST") {
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

        const payload = {
          ...data,
          receivedAt: new Date().toISOString()
        };

        fs.writeFileSync(LATEST_PATH, JSON.stringify(payload, null, 2));

        // Für Log nur die wichtigsten Felder behalten
        const logEntry = {
          ts: payload.receivedAt,
          temperature: data.temperature,
          humidity: data.humidity,
          soil1: data.soil1,
          soil2: data.soil2,
          soil3: data.soil3,
          relays: data.relays || {}
        };
        appendToLog(logEntry);

        res.statusCode = 200;
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.statusCode = 400;
        res.end(
          JSON.stringify({ error: "Invalid JSON", details: String(err) })
        );
      }
    });
    return;
  }

  // Browser holt die letzte Messung
  if (req.method === "GET") {
    try {
      if (!fs.existsSync(LATEST_PATH)) {
        res.statusCode = 200;
        res.end(JSON.stringify({ error: "No data yet" }));
        return;
      }
      const raw = fs.readFileSync(LATEST_PATH, "utf8");
      res.statusCode = 200;
      res.end(raw);
    } catch (err) {
      res.statusCode = 500;
      res.end(
        JSON.stringify({ error: "Failed to read latest", details: String(err) })
      );
    }
    return;
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ error: "Method not allowed" }));
};
