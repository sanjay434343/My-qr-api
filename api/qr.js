import axios from "axios";

export default async function handler(req, res) {
  // ✅ CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Preflight support
  if (req.method === "OPTIONS") return res.status(200).end();

  // ✅ Default QR config
  const defaultConfig = {
    body: "circular",
    eye: "frame12",
    eyeBall: "ball14",
    bodyColor: "#000000",
    bgColor: "#ffffff",
    logo: "https://github.com/sanjay434343/My-qr-api/blob/main/logo.png?raw=true",
    logoMode: "clean" // ✅ Rounded white background with logo
  };

  let data;
  let config = defaultConfig;

  if (req.method === "GET") {
    data = req.query.data;
    if (!data) return res.status(400).json({ error: "Missing 'data' query param" });
  } else if (req.method === "POST") {
    data = req.body.data;
    config = { ...defaultConfig, ...(req.body.config || {}) };
    if (!data) return res.status(400).json({ error: "Missing 'data' in body" });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const encodedData = encodeURIComponent(data);
    const encodedConfig = encodeURIComponent(JSON.stringify(config));

    const url = `https://api.qrcode-monkey.com/qr/custom?data=${encodedData}&size=300&file=png&config=${encodedConfig}`;

    const qrResponse = await axios.get(url, { responseType: "arraybuffer" });

    res.setHeader("Content-Type", "image/png");
    return res.status(200).send(qrResponse.data);
  } catch (err) {
    return res.status(500).json({ error: "QR generation failed", details: err.message });
  }
}
