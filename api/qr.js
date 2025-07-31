import axios from "axios";

export default async function handler(req, res) {
  // ✅ CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  let data;
  if (req.method === "GET") {
    data = req.query.data;
    if (!data) return res.status(400).json({ error: "Missing 'data' query param" });
  } else if (req.method === "POST") {
    data = req.body.data;
    if (!data) return res.status(400).json({ error: "Missing 'data' in body" });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const config = {
    data,
   const config = {
  body: "circular",
  eye: "frame12",
  eyeBall: "ball14",
  bodyColor: "#000000",
  bgColor: "#ffffff",
  logo: "https://raw.githubusercontent.com/sanjay434343/My-qr-api/main/logo.png",
  logoMode: "clean"
};

    size: 300,
    download: false,
    file: "png"
  };

  try {
    const qrResponse = await axios.post("https://api.qrcode-monkey.com/qr/custom", config, {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "application/json"
      }
    });

    res.setHeader("Content-Type", "image/png");
    res.status(200).send(qrResponse.data);
  } catch (err) {
    res.status(500).json({
      error: "QR generation failed",
      details: err.response?.data || err.message
    });
  }
}
