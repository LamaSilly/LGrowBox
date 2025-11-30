const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join("/tmp", "config.json");

// Default-Konfiguration (Veg-Phase)
function getDefaultConfig() {
  return {
    mode: "veg",

    light: {
      auto: true,
      onHour: 6,
      offHour: 0
    },

    heat: {
      enabled: true,
      comfortMin: 22.0,
      comfortMax: 26.0,
      hysteresis: 1.0
    },

    exhaust: {
      enabled: true,
      intervalEnabled: true,
      intervalSec: 600,
      runtimeSec: 120,
      tempOn: 27.0,
      tempOff: 25.5,
      humOn: 75.0,
      humOff: 65.0,
      extremeColdOffTemp: 18.0
    },

    fan: {
      enabled: true,
      intervalEnabled: true,
      intervalSec: 600,
      runtimeSec: 180,
      tempBoostOn: 26.0,
      tempBoostOff: 25.0,
      humBoostOn: 70.0,
      humBoostOff: 60.0
    },

    humidity: {
      targetMin: 55.0,
      targetMax: 70.0
    },

    safety: {
      safetyMaxTemp: 32.0,
      safetyMinTemp: 16.0,
      hardMaxHumidity: 90.0
    }
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
      const def = getDefaultConfig();
      res.statusCode = 200;
      res.end(JSON.stringify(def, null, 2));
      return;
    }

    const raw = fs.readFileSync(FILE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    res.statusCode = 200;
    res.end(JSON.stringify(parsed, null, 2));
  } catch (err) {
    res.statusCode = 500;
    res.end(
      JSON.stringify({ error: "Failed to read config", details: String(err) })
    );
  }
};
