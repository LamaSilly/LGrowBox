const crypto = require("crypto");

const ADMIN_PASSWORD = "growbox2025";

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

      if (data.password !== ADMIN_PASSWORD) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Wrong password" }));
        return;
      }

      const token = crypto.randomBytes(32).toString("hex");
      res.statusCode = 200;
      res.end({ token: token });
    } catch (err) {
      res.statusCode = 400;
      res.end(
        JSON.stringify({ error: "Invalid JSON", details: String(err) })
      );
    }
  });
};
