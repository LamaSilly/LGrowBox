const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join("/tmp", "config.json");

// Default-Konfiguration (Veg-Phase, sinnvolle Startwerte)
function getDefaultConfig() {
  return {
    mode: "veg", // "seedling" | "veg" | "bloom" | "custom"

    light: {
      auto: true,
      onHour: 6,  // 06:00 an
      offHour: 0  // 00:00 aus -> 18/6
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
      intervalSec: 600,   // alle 10 min
      runtimeSec: 120,    // 2 min an
      tempOn: 27.0,       // ab 27°C an
      tempOff: 25.5,      // unter 25.5°C wieder aus
      humOn: 75.0,        // ab 75% RH an
      humOff: 65.0,       // unter 65% RH aus
      extremeColdOffTemp: 18.0 // darunter lieber aus lassen
    },

    fan: {
      enabled: true,
      intervalEnabled: true,
      intervalSec: 600,   // alle 10 min
      runtimeSec: 180,    // 3 min
      tempBoostOn: 26.0,  // ab 26°C Dauer-AN
      tempBoostOff: 25.0,
      humBoostOn: 70.0,   // ab 70% Dauer-AN
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
