const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const BREVO_BASE = "https://api.brevo.com/v3";

app.all("/brevo/*", async (req, res) => {
  const path = req.params[0];
  const url = `${BREVO_BASE}/${path}${req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : ""}`;

  try {
    const fetchRes = await fetch(url, {
      method: req.method,
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: ["POST", "PUT", "PATCH"].includes(req.method) ? JSON.stringify(req.body) : undefined,
    });

    const text = await fetchRes.text();
    res.status(fetchRes.status);
    res.setHeader("Content-Type", "application/json");
    res.send(text || "{}");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => res.json({ status: "ok", message: "Brevo proxy running" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
