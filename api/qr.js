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

  const apiUrl = `https://api.qrcode-monkey.com/qr/custom`;
  const payload = {
    data,
    config: qrConfig,
    size: sizeNum,
    file: format.toLowerCase()
  };

  try {
    const response = await axios.post(apiUrl, payload, {
      responseType: "arraybuffer",
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'QR-API-Service/1.0',
        'Content-Type': 'application/json'
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
