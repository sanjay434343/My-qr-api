import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    data,
    nologo,
    body = "circular",
    eye = "frame12",
    eyeBall = "ball14",
    bodyColor = "#000000",
    bgColor = "#ffffff"
  } = req.query;

  if (!data) {
    return res.status(400).json({ error: "Missing 'data' query parameter" });
  }

  const qrConfig = {
    body,
    eye,
    eyeBall,
    bodyColor,
    bgColor
  };

  // Add logo if nologo is NOT true
  if (nologo !== "true") {
    qrConfig.logo = "https://raw.githubusercontent.com/sanjay434343/My-qr-api/main/logo.png";
    qrConfig.logoMode = "clean";
  }

  const apiUrl = `https://api.qrcode-monkey.com/qr/custom`;
  const payload = {
    data,
    config: qrConfig,
    size: 300,
    file: "png"
  };

  try {
    const response = await axios.post(apiUrl, payload, {
      responseType: "arraybuffer",
    });

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.status(200).send(Buffer.from(response.data));
  } catch (err) {
    const message = err.response?.data?.toString("utf8") || err.message;
    return res.status(500).json({
      error: "QR generation failed",
      details: message
    });
  }
}
