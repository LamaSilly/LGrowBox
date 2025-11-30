const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join("/tmp", "latest.json");

module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");

  // ESP schickt Daten per POST
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

        const payload = {
          ...data,
          receivedAt: new Date().toISOString(),
        };

        fs.writeFileSync(FILE_PATH, JSON.stringify(payload, null, 2));

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

  // Browser holt letzte Telemetrie per GET
  if (req.method === "GET") {
    if (!fs.existsSync(FILE_PATH)) {
      res.statusCode = 200;
      res.end(JSON.stringify({ error: "No data yet" }));
      return;
    }

    try {
      const data = fs.readFileSync(FILE_PATH, "utf8");
      res.statusCode = 200;
      res.end(data);
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
