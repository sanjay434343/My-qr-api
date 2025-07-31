# 🔳 QR Code API

A professional, feature-rich QR Code generation API with advanced customization options, content filtering, and security features.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sanjay434343/qr-api)

## 🚀 Live Demo

- **API Endpoint**: `https://my-qr-api.vercel.app/api/qr`
- **Documentation**: `https://my-qr-api.vercel.app/docs`

## ✨ Features

### 🎨 **Advanced Customization**
- **17+ Body Styles**: square, dot, rounded, circular, classy, diamond, star, and more
- **17+ Eye Styles**: Various frame designs (frame0-frame16)
- **20+ Eyeball Styles**: Different inner eye patterns (ball0-ball19)
- **Unlimited Colors**: Custom hex colors for body, background, eyes, and eyeballs
- **Gradient Support**: Linear and radial gradients with rotation
- **Multiple Formats**: PNG, JPG, SVG output formats
- **Custom Sizing**: 100-2000px dimensions
- **Logo Support**: Default or custom logo integration

### 🛡️ **Security & Content Filtering**
- **Adult Content Blocking**: Automatic filtering of inappropriate content
- **Rate Limiting**: 100 requests per hour per IP
- **Input Validation**: Comprehensive parameter validation
- **CORS Protection**: Secure cross-origin resource sharing
- **Request Timeout**: Protection against hanging requests
- **Error Logging**: Comprehensive error tracking

### 📱 **Developer Experience**
- **RESTful API**: Clean GET/POST endpoints
- **Interactive Documentation**: Beautiful UI with live examples
- **Real-time Testing**: Try API directly from docs
- **Comprehensive Examples**: Multiple use cases covered
- **Error Handling**: Detailed error responses with timestamps

## 🔧 Quick Start

### Basic Usage
```bash
# Generate a simple QR code
curl "https://my-qr-api.vercel.app/api/qr?data=Hello%20World"

# Custom colors and styling
curl "https://my-qr-api.vercel.app/api/qr?data=Styled&bodyColor=%23FF0000&bgColor=%23FFFF00&body=rounded"

# Large QR with gradient
curl "https://my-qr-api.vercel.app/api/qr?data=Gradient&gradient=true&gradientColor1=%23FF6B6B&gradientColor2=%234ECDC4&size=500"
```

### JavaScript Example
```javascript
// Fetch QR code as blob
const response = await fetch('https://my-qr-api.vercel.app/api/qr?data=Hello%20World&size=300');
const blob = await response.blob();
const imageUrl = URL.createObjectURL(blob);

// Display in img element
document.getElementById('qr-image').src = imageUrl;
```

### Python Example
```python
import requests

# Generate QR code
response = requests.get('https://my-qr-api.vercel.app/api/qr', params={
    'data': 'Hello World',
    'body': 'rounded',
    'bodyColor': '#FF0000',
    'size': 400
})

# Save to file
with open('qrcode.png', 'wb') as f:
    f.write(response.content)
```

## 📋 API Reference

### Endpoint
```
GET/POST https://my-qr-api.vercel.app/api/qr
```

### Required Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | string | Text or URL to encode in QR code |

### Optional Parameters

#### 🎨 **Styling Options**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `body` | string | `circular` | Body style (see available options below) |
| `eye` | string | `frame12` | Eye frame style (frame0-frame16) |
| `eyeBall` | string | `ball14` | Eye ball style (ball0-ball19) |

#### 🌈 **Color Options**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `bodyColor` | string | `#000000` | QR body color (hex format) |
| `bgColor` | string | `#ffffff` | Background color (hex format) |
| `eyeColor` | string | `#000000` | Eye frame color (hex format) |
| `eyeBallColor` | string | `#000000` | Eye ball color (hex format) |

#### 🎯 **Output Options**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `size` | number | `300` | Output size in pixels (100-2000) |
| `format` | string | `png` | Output format (png, jpg, svg) |

#### 🌟 **Advanced Options**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `gradient` | boolean | `false` | Enable gradient colors |
| `gradientColor1` | string | - | First gradient color (hex) |
| `gradientColor2` | string | - | Second gradient color (hex) |
| `gradientType` | string | `linear` | Gradient type (linear, radial) |
| `gradientRotation` | number | `0` | Gradient rotation in degrees |
| `nologo` | boolean | `false` | Disable default logo |
| `logoUrl` | string | - | Custom logo URL |
| `logoMode` | string | `clean` | Logo integration mode |

### Available Body Styles
```
square, dot, rounded, extra-rounded, classy, classy-rounded, circular, 
edge-cut, edge-cut-smooth, japnese, leaf, pointed, pointed-edge-cut, 
pointed-in, pointed-in-smooth, pointed-smooth, round-pointed, star, diamond
```

### Response Formats

#### Success Response (200)
Returns the QR code image in the specified format.

#### Error Response (400/429/500)
```json
{
  "error": "Error message",
  "details": "Additional details if available",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🎯 Usage Examples

### 1. Basic QR Code
```bash
https://my-qr-api.vercel.app/api/qr?data=Hello%20World
```

### 2. Website QR with Custom Style
```bash
https://my-qr-api.vercel.app/api/qr?data=https://github.com&body=rounded&eye=frame8&eyeBall=ball12&size=400
```

### 3. Colorful QR Code
```bash
https://my-qr-api.vercel.app/api/qr?data=Colorful&bodyColor=%23FF0000&bgColor=%23FFFF00&eyeColor=%230000FF
```

### 4. Gradient QR Code
```bash
https://my-qr-api.vercel.app/api/qr?data=Gradient&gradient=true&gradientColor1=%23FF6B6B&gradientColor2=%234ECDC4&body=classy
```

### 5. Professional Business Card
```bash
https://my-qr-api.vercel.app/api/qr?data=BEGIN:VCARD%0AVERSION:3.0%0AFN:John%20Doe%0AORG:Company%0ATEL:+1234567890%0AEMAIL:john@example.com%0AEND:VCARD&body=classy&bodyColor=%23333333&size=350
```

### 6. WiFi QR Code
```bash
https://my-qr-api.vercel.app/api/qr?data=WIFI:T:WPA;S:MyNetwork;P:MyPassword;;&body=rounded&bodyColor=%234CAF50&size=300
```

### 7. Large SVG Format
```bash
https://my-qr-api.vercel.app/api/qr?data=Vector%20QR&format=svg&size=800&body=star&nologo=true
```

## 🚀 Deployment

### Deploy to Vercel
1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import the project
4. Deploy automatically

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sanjay434343/qr-api)

### Deploy to Netlify
1. Fork this repository
2. Connect to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### Manual Deployment
```bash
# Clone the repository
git clone https://github.com/sanjay434343/qr-api.git
cd qr-api

# Install dependencies
npm install

# Build for production
npm run build

# Start the server
npm start
```

## 🛠️ Development

### Local Setup
```bash
# Clone the repository
git clone https://github.com/sanjay434343/qr-api.git
cd qr-api

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables
Create a `.env.local` file:
```env
NODE_ENV=development
API_RATE_LIMIT=100
```

### File Structure
```
qr-api/
├── pages/
│   └── api/
│       └── qr.js          # Main API endpoint
├── public/
│   └── logo.png           # Default logo
├── package.json
├── README.md
└── vercel.json           # Vercel configuration
```

## 🔒 Security Features

- **Content Filtering**: Blocks adult content, suspicious URLs, and harmful material
- **Rate Limiting**: Prevents API abuse with IP-based limits
- **Input Validation**: Validates all parameters and sanitizes input
- **CORS Protection**: Configurable cross-origin resource sharing
- **Error Handling**: Secure error messages without exposing system details
- **Request Timeout**: Prevents resource exhaustion from hanging requests

## 📊 Rate Limits

- **Default**: 100 requests per hour per IP address
- **Window**: Rolling 60-minute window
- **Response**: HTTP 429 with retry information
- **Storage**: In-memory (use Redis for production scaling)

## 🐛 Error Handling

The API returns detailed error responses with appropriate HTTP status codes:

- `400 Bad Request`: Invalid parameters or blocked content
- `405 Method Not Allowed`: Unsupported HTTP method
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server-side errors
- `504 Gateway Timeout`: Request timeout

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live API**: https://my-qr-api.vercel.app/api/qr
- **Documentation**: https://my-qr-api.vercel.app/docs
- **GitHub**: https://github.com/sanjay434343/qr-api
- **Issues**: https://github.com/sanjay434343/qr-api/issues
- **Author**: [@sanjay434343](https://github.com/sanjay434343)

## 💡 Tips & Best Practices

### Performance Optimization
- Use appropriate image sizes (300-500px for most use cases)
- Cache QR codes on your client side
- Use SVG format for scalable graphics
- Implement client-side rate limiting

### Design Recommendations
- Ensure sufficient contrast between body and background colors
- Test QR codes with actual scanners before production use
- Consider logo size and placement for readability
- Use error correction level 'M' or 'H' for better reliability

### Security Considerations
- Validate QR code content on your application side
- Don't encode sensitive information directly
- Use HTTPS for logo URLs
- Implement additional rate limiting for production use

---

**Built with ❤️ by [@sanjay434343](https://github.com/sanjay434343) for developers who need reliable QR code generation**

## 🌟 Show Your Support

If this project helped you, please consider:
- ⭐ Starring the repository
- 🐛 Reporting issues
- 🤝 Contributing improvements
- 📢 Sharing with other developers

**Follow me on GitHub**: [@sanjay434343](https://github.com/sanjay434343)
