// File: api/qr.js
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

  // Show UI if no query provided (fallback page)
  if (!data) {
    res.setHeader("Content-Type", "text/html");
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>QR Code Generator API</title>
        <style>
          body {
            font-family: sans-serif;
            text-align: center;
            padding: 2rem;
            background-color: #f9f9f9;
          }
          input, button {
            padding: 10px;
            margin: 10px;
            font-size: 16px;
            width: 80%;
            max-width: 400px;
          }
          img {
            margin-top: 20px;
            max-width: 300px;
          }
          .doc {
            text-align: left;
            max-width: 600px;
            margin: 2rem auto;
            padding: 1rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 0 10px #ddd;
          }
          code {
            background: #eee;
            padding: 2px 4px;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <h1>🎯 Custom QR Code Generator</h1>
        <p>Enter any text or URL to generate a styled QR Code.</p>
        <input id="input" type="text" placeholder="Enter URL or text" />
        <br />
        <button onclick="genQR()">Generate QR Code</button>
        <br />
        <img id="qr" hidden />

        <div class="doc">
          <h2>📘 API Documentation</h2>
          <p><strong>Endpoint:</strong> <code>/api/qr</code></p>
          <p><strong>Method:</strong> <code>GET</code></p>
          <p><strong>Required Query:</strong> <code>?data=yourTextOrURL</code></p>
          <p><strong>Optional:</strong></p>
          <ul>
            <li><code>nologo=true</code> – disables logo</li>
            <li><code>body</code> – QR shape style (default: circular)</li>
            <li><code>eye</code> – eye frame style (default: frame12)</li>
            <li><code>eyeBall</code> – eyeball style (default: ball14)</li>
            <li><code>bodyColor</code> – hex color for QR (default: #000000)</li>
            <li><code>bgColor</code> – hex background (default: #ffffff)</li>
          </ul>
          <p><strong>Example:</strong></p>
          <code>https://your-deploy-url/api/qr?data=https://example.com</code>
        </div>

        <script>
          function genQR() {
            const input = document.getElementById("input").value;
            if (!input) return alert("Please enter some data!");
            const qrUrl = \`/api/qr?data=\${encodeURIComponent(input)}\`;
            const img = document.getElementById("qr");
            img.src = qrUrl;
            img.hidden = false;
          }
        </script>
      </body>
      </html>
    `);
  }

  // Proceed to QR generation if ?data= is given
  const qrConfig = {
    body,
    eye,
    eyeBall,
    bodyColor,
    bgColor
  };

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
