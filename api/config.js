{
  "mode": "veg",                 // "seedling" | "veg" | "bloom" | "custom"

  "light": {
    "auto": true,
    "onHour": 6,                 // 06:00 an
    "offHour": 0                 // 00:00 aus (=> 18/6)
  },

  "heat": {
    "enabled": true,
    "comfortMin": 22.0,          // darunter Heizung an
    "comfortMax": 26.0,          // darüber sicher aus
    "hysteresis": 1.0            // kleines Pufferband
  },

  "exhaust": {
    "enabled": true,
    "intervalEnabled": true,
    "intervalSec": 600,          // alle 10 min
    "runtimeSec": 120,           // für 2 min an

    "tempOn": 27.0,              // ab 27°C Abluft an
    "tempOff": 25.5,             // unter 25.5°C wieder aus

    "humOn": 75.0,               // ab 75% Abluft an
    "humOff": 65.0,              // unter 65% wieder aus

    "extremeColdOffTemp": 18.0   // darunter Abluft aus lassen, auch wenn feucht
  },

  "fan": {
    "enabled": true,
    "intervalEnabled": true,
    "intervalSec": 600,          // alle 10 min
    "runtimeSec": 180,           // 3 min Umluft

    "tempBoostOn": 26.0,         // ab 26°C Umluft Dauer-AN
    "tempBoostOff": 25.0,

    "humBoostOn": 70.0,          // ab 70% Umluft Dauer-AN
    "humBoostOff": 60.0
  },

  "humidity": {
    "targetMin": 55.0,           // für Anzeigen / späteres Finetuning
    "targetMax": 70.0
  },

  "safety": {
    "safetyMaxTemp": 32.0,       // darüber: Heizung AUS, Abluft AN
    "safetyMinTemp": 16.0,       // darunter: Abluft AUS, Heizung bevorzugt
    "hardMaxHumidity": 90.0      // extremes Feuchte-Limit
  }
}
