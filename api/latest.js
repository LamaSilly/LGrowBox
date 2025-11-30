const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join("/tmp", "latest.json");

module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (!fs.existsSync(FILE_PATH)) {
    res.statusCode = 200;
    res.end(JSON.stringify({ error: "No data yet" }));
    return;
  }

  try {
    const data = fs.readFileSync(FILE_PATH, "utf8");
    res.statusCode = 200;
    res.end(data); // Inhalt von latest.json direkt zurück
  } catch (err) {
    res.statusCode = 500;
    res.end(
      JSON.stringify({ error: "Failed to read latest", details: String(err) })
    );
  }
};
