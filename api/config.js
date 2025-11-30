const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join("/tmp", "config.json");

// Default-Konfiguration, falls noch nichts gespeichert wurde
function getDefaultConfig() {
  return {
    profile: "veg",
    temp: {
      heatOn: 22.0,
      heatOff: 24.0,
    },
    humidity: {
      min: 60,
      max: 75,
    },
    light: {
      onHour: 6,
      offHour: 0,
    },
  };
}

module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Only GET allowed" }));
    return;
  }

  try {
    if (!fs.existsSync(FILE_PATH)) {
      res.statusCode = 200;
      res.end(JSON.stringify(getDefaultConfig(), null, 2));
      return;
    }

    const data = fs.readFileSync(FILE_PATH, "utf8");
    res.statusCode = 200;
    res.end(data);
  } catch (err) {
    res.statusCode = 500;
    res.end(
      JSON.stringify({ error: "Failed to read config", details: String(err) })
    );
  }
};
