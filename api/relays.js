const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join("/tmp", "relays.json");

// Standardzustand
function getDefaultState() {
  return {
    heat: false,
    fan: false,
    exhaust: false,
    light: false,
  };
}

function readState() {
  try {
    if (!fs.existsSync(FILE_PATH)) return getDefaultState();
    const raw = fs.readFileSync(FILE_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return getDefaultState();
  }
}

function writeState(state) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(state, null, 2));
}

module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");

  // Zustand abfragen
  if (req.method === "GET") {
    const state = readState();
    res.statusCode = 200;
    res.end(JSON.stringify(state));
    return;
  }

  // Zustand setzen
  if (req.method === "POST") {
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

        const current = readState();
        const next = {
          heat: typeof data.heat === "boolean" ? data.heat : current.heat,
          fan: typeof data.fan === "boolean" ? data.fan : current.fan,
          exhaust:
            typeof data.exhaust === "boolean" ? data.exhaust : current.exhaust,
          light: typeof data.light === "boolean" ? data.light : current.light,
        };

        writeState(next);
        res.statusCode = 200;
        res.end(JSON.stringify(next));
      } catch (err) {
        res.statusCode = 400;
        res.end(
          JSON.stringify({ error: "Invalid JSON", details: String(err) })
        );
      }
    });
    return;
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ error: "Method not allowed" }));
};
