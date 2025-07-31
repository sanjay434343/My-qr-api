import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { data, config = {} } = req.body;

  if (!data) {
    return res.status(400).json({ error: "Missing 'data' field" });
  }

  // Default config
  const defaultConfig = {
    body: "circular",
    eye: "frame12",
    eyeBall: "ball14",
    bodyColor: "#000000",
    bgColor: "#ffffff"
  };

  const mergedConfig = { ...defaultConfig, ...config };

  try {
    const encodedData = encodeURIComponent(data);
    const encodedConfig = encodeURIComponent(JSON.stringify(mergedConfig));

    const url = `https://api.qrcode-monkey.com/qr/custom?data=${encodedData}&size=300&file=png&config=${encodedConfig}`;

    const response = await axios.get(url, { responseType: "arraybuffer" });

    res.setHeader("Content-Type", "image/png");
    return res.status(200).send(response.data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to generate QR code", details: err.message });
  }
}
