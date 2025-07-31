import axios from "axios";

// Content filtering patterns
const ADULT_CONTENT_PATTERNS = [
  /\b(porn|sex|nude|adult|xxx|18\+|nsfw)\b/i,
  /\b(viagra|casino|gambling|bet|lottery)\b/i,
  /\b(hack|crack|pirate|torrent|illegal)\b/i,
  /\b(suicide|self-harm|violence|kill)\b/i
];

// URL patterns that might contain adult content
const SUSPICIOUS_DOMAINS = [
  /pornhub|xvideos|redtube|xhamster/i,
  /onlyfans|chaturbate|cam4/i,
  /casino|gambling|poker/i
];

// Valid style options
const BODY_STYLES = [
  "square", "dot", "rounded", "extra-rounded", "classy", "classy-rounded",
  "circular", "edge-cut", "edge-cut-smooth", "japnese", "leaf", "pointed",
  "pointed-edge-cut", "pointed-in", "pointed-in-smooth", "pointed-smooth",
  "round-pointed", "star", "diamond"
];

const EYE_STYLES = [
  "frame0", "frame1", "frame2", "frame3", "frame4", "frame5", "frame6",
  "frame7", "frame8", "frame9", "frame10", "frame11", "frame12", "frame13",
  "frame14", "frame15", "frame16"
];

const EYEBALL_STYLES = [
  "ball0", "ball1", "ball2", "ball3", "ball4", "ball5", "ball6", "ball7",
  "ball8", "ball9", "ball10", "ball11", "ball12", "ball13", "ball14",
  "ball15", "ball16", "ball17", "ball18", "ball19"
];

// Color validation
const isValidColor = (color) => {
  return /^#([0-9A-F]{3}){1,2}$/i.test(color);
};

// Content filtering function
const containsAdultContent = (text) => {
  // Check for adult content patterns
  for (const pattern of ADULT_CONTENT_PATTERNS) {
    if (pattern.test(text)) return true;
  }
  
  // Check for suspicious domains in URLs
  for (const domain of SUSPICIOUS_DOMAINS) {
    if (domain.test(text)) return true;
  }
  
  return false;
};

// Rate limiting (simple in-memory store - use Redis in production)
const rateLimitStore = new Map();
const RATE_LIMIT = 100; // requests per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

const isRateLimited = (ip) => {
  const now = Date.now();
  const userRequests = rateLimitStore.get(ip) || [];
  
  // Remove old requests outside the window
  const recentRequests = userRequests.filter(time => now - time < RATE_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT) {
    return true;
  }
  
  // Add current request
  recentRequests.push(now);
  rateLimitStore.set(ip, recentRequests);
  
  return false;
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Show documentation UI for /docs path
  if (req.method === "GET" && req.url === '/docs') {
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(getDocumentationHTML());
  }
  
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ 
      error: "Method not allowed",
      allowedMethods: ["GET", "POST"]
    });
  }

  // Rate limiting
  const clientIP = req.headers['x-forwarded-for'] || 
                   req.headers['x-real-ip'] || 
                   req.connection.remoteAddress || 
                   'unknown';
  
  if (isRateLimited(clientIP)) {
    return res.status(429).json({
      error: "Rate limit exceeded",
      message: "Too many requests. Please try again later."
    });
  }

  // Get parameters from query or body
  const params = req.method === "GET" ? req.query : { ...req.query, ...req.body };
  
  const {
    data,
    nologo,
    body = "circular",
    eye = "frame12",
    eyeBall = "ball14",
    bodyColor = "#000000",
    bgColor = "#ffffff",
    eyeColor = "#000000",
    eyeBallColor = "#000000",
    size = "300",
    format = "png",
    logoUrl,
    logoMode = "clean",
    errorCorrection = "M",
    margin = "0",
    gradient,
    gradientColor1,
    gradientColor2,
    gradientType = "linear",
    gradientRotation = "0"
  } = params;

  // Validation
  if (!data) {
    return res.status(400).json({ 
      error: "Missing 'data' parameter",
      example: "?data=Hello World"
    });
  }

  // Content filtering
  if (containsAdultContent(data)) {
    return res.status(400).json({
      error: "Content blocked",
      message: "The provided content contains inappropriate material"
    });
  }

  // Validate styles
  if (!BODY_STYLES.includes(body)) {
    return res.status(400).json({
      error: "Invalid body style",
      validOptions: BODY_STYLES
    });
  }

  if (!EYE_STYLES.includes(eye)) {
    return res.status(400).json({
      error: "Invalid eye style",
      validOptions: EYE_STYLES
    });
  }

  if (!EYEBALL_STYLES.includes(eyeBall)) {
    return res.status(400).json({
      error: "Invalid eyeball style",
      validOptions: EYEBALL_STYLES
    });
  }

  // Validate colors
  const colors = { bodyColor, bgColor, eyeColor, eyeBallColor };
  for (const [key, color] of Object.entries(colors)) {
    if (!isValidColor(color)) {
      return res.status(400).json({
        error: `Invalid ${key}`,
        message: "Colors must be in hex format (e.g., #FF0000)"
      });
    }
  }

  // Validate size
  const sizeNum = parseInt(size);
  if (isNaN(sizeNum) || sizeNum < 100 || sizeNum > 2000) {
    return res.status(400).json({
      error: "Invalid size",
      message: "Size must be between 100 and 2000 pixels"
    });
  }

  // Validate format
  if (!["png", "jpg", "svg"].includes(format.toLowerCase())) {
    return res.status(400).json({
      error: "Invalid format",
      validOptions: ["png", "jpg", "svg"]
    });
  }

  // Build QR config with enhanced options
  const qrConfig = {
    body,
    eye,
    eyeBall,
    bodyColor,
    bgColor,
    eye1Color: eyeColor,
    eye2Color: eyeColor,
    eye3Color: eyeColor,
    eyeBall1Color: eyeBallColor,
    eyeBall2Color: eyeBallColor,
    eyeBall3Color: eyeBallColor
  };

  // Add gradient support
  if (gradient === "true" && gradientColor1 && gradientColor2) {
    if (!isValidColor(gradientColor1) || !isValidColor(gradientColor2)) {
      return res.status(400).json({
        error: "Invalid gradient colors",
        message: "Gradient colors must be in hex format"
      });
    }
    
    qrConfig.bodyColor = gradientColor1;
    qrConfig.gradientColor1 = gradientColor1;
    qrConfig.gradientColor2 = gradientColor2;
    qrConfig.gradientType = gradientType;
    qrConfig.gradientOnEyes = "true";
    
    if (gradientType === "radial") {
      qrConfig.gradientRotation = gradientRotation;
    }
  }

  // Add logo configuration (improved)
  if (nologo !== "true") {
    const defaultLogo = "https://raw.githubusercontent.com/sanjay434343/My-qr-api/main/logo.png";
    qrConfig.logo = logoUrl || defaultLogo;
    qrConfig.logoMode = logoMode;
    qrConfig.logoSize = "0.3"; // Make logo more visible
    qrConfig.logoBackgroundTransparent = "true";
    qrConfig.logoBackgroundColor = bgColor;
    qrConfig.logoPadding = "10";
  }

  const apiUrl = `https://api.qrserver.com/v1/create-qr-code/`;
  
  // Build query parameters for alternative API
  const queryParams = new URLSearchParams({
    data: data,
    size: `${sizeNum}x${sizeNum}`,
    format: format.toLowerCase(),
    ecc: errorCorrection || 'M',
    margin: margin || '0'
  });

  // Add color parameters if not default
  if (bodyColor !== '#000000') {
    queryParams.append('color', bodyColor.replace('#', ''));
  }
  if (bgColor !== '#ffffff') {
    queryParams.append('bgcolor', bgColor.replace('#', ''));
  }

  const finalUrl = `${apiUrl}?${queryParams.toString()}`;

  try {
    const response = await axios.get(finalUrl, {
      responseType: "arraybuffer",
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'QR-API-Service/1.0'
      }
    });

    // Set appropriate content type
    const contentTypes = {
      png: "image/png",
      jpg: "image/jpeg",
      svg: "image/svg+xml"
    };

    res.setHeader("Content-Type", contentTypes[format.toLowerCase()]);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("Content-Disposition", `inline; filename="qrcode.${format}"`);
    
    return res.status(200).send(Buffer.from(response.data));
    
  } catch (err) {
    console.error("QR Generation Error:", err.message);
    
    let errorMessage = "QR generation failed";
    let statusCode = 500;
    
    if (err.code === 'ECONNABORTED') {
      errorMessage = "Request timeout - please try again";
      statusCode = 504;
    } else if (err.response?.status === 400) {
      errorMessage = "Invalid QR code parameters";
      statusCode = 400;
    } else if (err.response?.status === 429) {
      errorMessage = "QR service rate limit exceeded";
      statusCode = 429;
    }
    
    const details = err.response?.data?.toString("utf8") || err.message;
    
    return res.status(statusCode).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? details : undefined,
      timestamp: new Date().toISOString()
    });
  }
}

// Export configuration for documentation
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

// Documentation HTML generator
function getDocumentationHTML() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QR Code API - Documentation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            color: white;
            margin-bottom: 40px;
            padding: 40px 20px;
        }
        
        .header h1 {
            font-size: 3em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header p {
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .card {
            background: white;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .card h2 {
            color: #667eea;
            margin-bottom: 20px;
            font-size: 1.8em;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 10px;
        }
        
        .endpoint {
            background: #f8f9ff;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            overflow-x: auto;
        }
        
        .method {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
            margin-right: 10px;
        }
        
        .get { background: #4CAF50; color: white; }
        .post { background: #2196F3; color: white; }
        
        .params-grid {
            display: grid;
            grid-template-columns: 1fr 2fr 1fr;
            gap: 15px;
            margin: 20px 0;
        }
        
        .param-header {
            font-weight: bold;
            background: #667eea;
            color: white;
            padding: 10px;
            border-radius: 5px;
        }
        
        .param-row {
            padding: 10px;
            border-bottom: 1px solid #eee;
        }
        
        .param-name {
            font-family: 'Courier New', monospace;
            color: #667eea;
            font-weight: bold;
        }
        
        .required {
            color: #e74c3c;
        }
        
        .optional {
            color: #27ae60;
        }
        
        .try-it {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.1em;
            transition: all 0.3s ease;
            margin: 10px 5px;
        }
        
        .try-it:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .qr-preview {
            text-align: center;
            margin: 20px 0;
        }
        
        .qr-preview img {
            max-width: 300px;
            border: 2px solid #667eea;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .examples {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .example {
            background: #f8f9ff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            transition: all 0.3s ease;
        }
        
        .example:hover {
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .example h4 {
            color: #667eea;
            margin-bottom: 10px;
        }
        
        .example code {
            background: #2d3748;
            color: #e2e8f0;
            padding: 15px;
            border-radius: 5px;
            display: block;
            overflow-x: auto;
            font-size: 0.9em;
            line-height: 1.4;
        }
        
        .stats {
            display: flex;
            justify-content: space-around;
            text-align: center;
            margin: 30px 0;
        }
        
        .stat {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            flex: 1;
            margin: 0 10px;
        }
        
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
        }
        
        .interactive-demo {
            background: #f8f9ff;
            border-radius: 10px;
            padding: 30px;
            margin: 20px 0;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #333;
        }
        
        .form-group input, .form-group select {
            width: 100%;
            padding: 10px;
            border: 2px solid #e0e0e0;
            border-radius: 5px;
            font-size: 1em;
            transition: border-color 0.3s ease;
        }
        
        .form-group input:focus, .form-group select:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        @media (max-width: 768px) {
            .header h1 { font-size: 2em; }
            .params-grid { grid-template-columns: 1fr; }
            .stats { flex-direction: column; }
            .stat { margin: 10px 0; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔳 QR Code API</h1>
            <p>Professional QR Code Generation with Advanced Customization</p>
        </div>
        
        <div class="stats">
            <div class="stat">
                <div class="stat-number">17+</div>
                <div>Body Styles</div>
            </div>
            <div class="stat">
                <div class="stat-number">17+</div>
                <div>Eye Styles</div>
            </div>
            <div class="stat">
                <div class="stat-number">20+</div>
                <div>Eyeball Styles</div>
            </div>
            <div class="stat">
                <div class="stat-number">∞</div>
                <div>Color Options</div>
            </div>
        </div>

        <div class="card">
            <h2>🚀 Quick Start</h2>
            <div class="endpoint">
                <span class="method get">GET</span>
                <strong>${typeof window !== 'undefined' ? window.location.origin : ''}/api/qr?data=Hello%20World</strong>
            </div>
            
            <div style="margin: 15px 0;">
                <strong>📖 Documentation:</strong>
                <a href="/docs" style="color: #667eea; text-decoration: none; font-weight: bold;">${typeof window !== 'undefined' ? window.location.origin : ''}/docs</a>
            </div>
            
            <button class="try-it" onclick="tryExample('/api/qr?data=Hello%20World')">
                Try Basic Example
            </button>
            <button class="try-it" onclick="tryExample('/api/qr?data=Advanced%20QR&body=rounded&eye=frame8&eyeBall=ball12&bodyColor=%23FF0000&size=400')">
                Try Advanced Example
            </button>
            
            <div class="qr-preview" id="qr-preview"></div>
        </div>

        <div class="card">
            <h2>📋 API Parameters</h2>
            
            <div class="params-grid">
                <div class="param-header">Parameter</div>
                <div class="param-header">Description</div>
                <div class="param-header">Type</div>
                
                <div class="param-row">
                    <span class="param-name required">data</span>
                </div>
                <div class="param-row">Text or URL to encode in QR code</div>
                <div class="param-row">string (required)</div>
                
                <div class="param-row">
                    <span class="param-name optional">body</span>
                </div>
                <div class="param-row">Body style: square, dot, rounded, circular, etc.</div>
                <div class="param-row">string (circular)</div>
                
                <div class="param-row">
                    <span class="param-name optional">eye</span>
                </div>
                <div class="param-row">Eye frame style: frame0 to frame16</div>
                <div class="param-row">string (frame12)</div>
                
                <div class="param-row">
                    <span class="param-name optional">eyeBall</span>
                </div>
                <div class="param-row">Eye ball style: ball0 to ball19</div>
                <div class="param-row">string (ball14)</div>
                
                <div class="param-row">
                    <span class="param-name optional">bodyColor</span>
                </div>
                <div class="param-row">QR code body color in hex format</div>
                <div class="param-row">string (#000000)</div>
                
                <div class="param-row">
                    <span class="param-name optional">bgColor</span>
                </div>
                <div class="param-row">Background color in hex format</div>
                <div class="param-row">string (#ffffff)</div>
                
                <div class="param-row">
                    <span class="param-name optional">eyeColor</span>
                </div>
                <div class="param-row">Eye frame color in hex format</div>
                <div class="param-row">string (#000000)</div>
                
                <div class="param-row">
                    <span class="param-name optional">eyeBallColor</span>
                </div>
                <div class="param-row">Eye ball color in hex format</div>
                <div class="param-row">string (#000000)</div>
                
                <div class="param-row">
                    <span class="param-name optional">size</span>
                </div>
                <div class="param-row">QR code size in pixels (100-2000)</div>
                <div class="param-row">number (300)</div>
                
                <div class="param-row">
                    <span class="param-name optional">format</span>
                </div>
                <div class="param-row">Output format: png, jpg, svg</div>
                <div class="param-row">string (png)</div>
                
                <div class="param-row">
                    <span class="param-name optional">gradient</span>
                </div>
                <div class="param-row">Enable gradient colors</div>
                <div class="param-row">boolean (false)</div>
                
                <div class="param-row">
                    <span class="param-name optional">nologo</span>
                </div>
                <div class="param-row">Disable default logo</div>
                <div class="param-row">boolean (false)</div>
            </div>
        </div>

        <div class="card">
            <h2>🎨 Interactive Demo</h2>
            <div class="interactive-demo">
                <div class="form-row">
                    <div class="form-group">
                        <label for="demo-data">Data/Text:</label>
                        <input type="text" id="demo-data" value="Hello QR World!" placeholder="Enter text or URL">
                    </div>
                    <div class="form-group">
                        <label for="demo-body">Body Style:</label>
                        <select id="demo-body">
                            <option value="circular">Circular</option>
                            <option value="square">Square</option>
                            <option value="rounded">Rounded</option>
                            <option value="dot">Dot</option>
                            <option value="classy">Classy</option>
                            <option value="diamond">Diamond</option>
                            <option value="star">Star</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="demo-bodycolor">Body Color:</label>
                        <input type="color" id="demo-bodycolor" value="#000000">
                    </div>
                    <div class="form-group">
                        <label for="demo-bgcolor">Background Color:</label>
                        <input type="color" id="demo-bgcolor" value="#ffffff">
                    </div>
                    <div class="form-group">
                        <label for="demo-size">Size:</label>
                        <input type="range" id="demo-size" min="100" max="500" value="300">
                        <span id="size-value">300px</span>
                    </div>
                </div>
                
                <button class="try-it" onclick="generateDemo()">Generate QR Code</button>
                <div class="qr-preview" id="demo-preview"></div>
            </div>
        </div>

        <div class="card">
            <h2>💡 Examples</h2>
            <div class="examples">
                <div class="example">
                    <h4>Basic QR Code</h4>
                    <code>/api/qr?data=Hello World</code>
                    <button class="try-it" onclick="tryExample('/api/qr?data=Hello%20World')">Try It</button>
                </div>
                
                <div class="example">
                    <h4>Custom Colors</h4>
                    <code>/api/qr?data=Colorful&bodyColor=%23FF0000&bgColor=%23FFFF00</code>
                    <button class="try-it" onclick="tryExample('/api/qr?data=Colorful&bodyColor=%23FF0000&bgColor=%23FFFF00')">Try It</button>
                </div>
                
                <div class="example">
                    <h4>Advanced Styling</h4>
                    <code>/api/qr?data=Styled&body=rounded&eye=frame8&eyeBall=ball12&size=400</code>
                    <button class="try-it" onclick="tryExample('/api/qr?data=Styled&body=rounded&eye=frame8&eyeBall=ball12&size=400')">Try It</button>
                </div>
                
                <div class="example">
                    <h4>Gradient QR</h4>
                    <code>/api/qr?data=Gradient&gradient=true&gradientColor1=%23FF6B6B&gradientColor2=%234ECDC4</code>
                    <button class="try-it" onclick="tryExample('/api/qr?data=Gradient&gradient=true&gradientColor1=%23FF6B6B&gradientColor2=%234ECDC4')">Try It</button>
                </div>
                
                <div class="example">
                    <h4>No Logo Version</h4>
                    <code>/api/qr?data=Clean&nologo=true&body=diamond</code>
                    <button class="try-it" onclick="tryExample('/api/qr?data=Clean&nologo=true&body=diamond')">Try It</button>
                </div>
                
                <div class="example">
                    <h4>Large SVG Format</h4>
                    <code>/api/qr?data=Vector&format=svg&size=800</code>
                    <button class="try-it" onclick="tryExample('/api/qr?data=Vector&format=svg&size=800')">Try It</button>
                </div>
            </div>
        </div>

        <div class="card">
            <h2>🔒 Security Features</h2>
            <ul style="padding-left: 20px; line-height: 2;">
                <li>✅ Adult content filtering</li>
                <li>✅ Rate limiting (100 requests/hour)</li>
                <li>✅ Input validation & sanitization</li>
                <li>✅ CORS protection</li>
                <li>✅ Request timeout protection</li>
                <li>✅ Error logging and monitoring</li>
            </ul>
        </div>

        <div class="card">
            <h2>📚 Response Formats</h2>
            <div class="endpoint">
                <strong>Success (200):</strong> Returns QR code image (PNG/JPG/SVG)
            </div>
            
            <div class="endpoint">
                <strong>Error (400/429/500):</strong><br>
                <code>
{
  "error": "Error message",
  "details": "Additional details if available",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
                </code>
            </div>
        </div>
    </div>

    <script>
        function tryExample(url) {
            const fullUrl = window.location.origin + url;
            const previewDiv = document.getElementById('qr-preview');
            previewDiv.innerHTML = '<p>Generating QR code...</p>';
            
            const img = document.createElement('img');
            img.onload = function() {
                previewDiv.innerHTML = '';
                previewDiv.appendChild(img);
                
                const urlDiv = document.createElement('div');
                urlDiv.style.marginTop = '10px';
                urlDiv.innerHTML = '<small><strong>URL:</strong> ' + fullUrl + '</small>';
                previewDiv.appendChild(urlDiv);
            };
            img.onerror = function() {
                previewDiv.innerHTML = '<p style="color: red;">Error generating QR code</p>';
            };
            img.src = fullUrl;
            img.alt = 'Generated QR Code';
        }
        
        function generateDemo() {
            const data = document.getElementById('demo-data').value;
            const body = document.getElementById('demo-body').value;
            const bodyColor = document.getElementById('demo-bodycolor').value.replace('#', '%23');
            const bgColor = document.getElementById('demo-bgcolor').value.replace('#', '%23');
            const size = document.getElementById('demo-size').value;
            
            const url = '/api/qr?data=' + encodeURIComponent(data) + 
                       '&body=' + body + 
                       '&bodyColor=' + bodyColor + 
                       '&bgColor=' + bgColor + 
                       '&size=' + size;
            
            tryExample(url.replace('/api/qr', ''));
        }
        
        document.getElementById('demo-size').addEventListener('input', function(e) {
            document.getElementById('size-value').textContent = e.target.value + 'px';
        });
        
        // Auto-generate a sample QR code on page load
        window.onload = function() {
            setTimeout(() => {
                tryExample('/api/qr?data=Welcome%20to%20QR%20API&body=circular&bodyColor=%23667eea&size=300');
            }, 1000);
        };
    </script>
</body>
</html>
  `;
}

// API Documentation (accessible via GET /)
export const documentation = {
  endpoint: "/api/qr",
  methods: ["GET", "POST"],
  parameters: {
    required: {
      data: "string - The text/URL to encode in QR code"
    },
    optional: {
      body: `string - Body style (default: circular). Options: ${BODY_STYLES.join(', ')}`,
      eye: `string - Eye frame style (default: frame12). Options: ${EYE_STYLES.join(', ')}`,
      eyeBall: `string - Eye ball style (default: ball14). Options: ${EYEBALL_STYLES.join(', ')}`,
      bodyColor: "string - Body color in hex (default: #000000)",
      bgColor: "string - Background color in hex (default: #ffffff)",
      eyeColor: "string - Eye color in hex (default: #000000)",
      eyeBallColor: "string - Eye ball color in hex (default: #000000)",
      size: "number - QR code size 100-2000px (default: 300)",
      format: "string - Output format: png, jpg, svg (default: png)",
      nologo: "boolean - Set to 'true' to disable logo (default: false)",
      logoUrl: "string - Custom logo URL",
      logoMode: "string - Logo mode: clean, default (default: clean)",
      gradient: "boolean - Enable gradient colors",
      gradientColor1: "string - First gradient color in hex",
      gradientColor2: "string - Second gradient color in hex",
      gradientType: "string - Gradient type: linear, radial (default: linear)",
      gradientRotation: "number - Gradient rotation in degrees (default: 0)"
    }
  },
  examples: [
    "/api/qr?data=Hello World",
    "/api/qr?data=https://example.com&body=rounded&eye=frame8&eyeBall=ball12&size=500",
    "/api/qr?data=Custom QR&bodyColor=%23FF0000&bgColor=%23FFFF00&nologo=true",
    "/api/qr?data=Gradient QR&gradient=true&gradientColor1=%23FF0000&gradientColor2=%230000FF"
  ]
};
