# 🎯 Custom QR Code API

This is a **simple yet powerful** QR Code generator API built using Node.js and Axios. It acts as a middleware to generate styled QR codes using the [QRCode Monkey API](https://www.qrcode-monkey.com/). Optionally supports embedding a logo in the center.

---

## 🔗 Live API Endpoint

```
GET https://your-deployment-url.vercel.app/api/qr
```

---

## ⚙️ Query Parameters

| Parameter   | Type     | Default      | Description                                                                 |
|-------------|----------|--------------|-----------------------------------------------------------------------------|
| `data`      | string   | **required** | The content to encode in the QR code (URL, text, etc).                     |
| `nologo`    | boolean  | false        | If set to `"true"`, logo will be removed from the center.                  |
| `body`      | string   | `"circular"` | QR body style. [See styles](#🎨-qr-customization-styles)                   |
| `eye`       | string   | `"frame12"`  | Outer eye style of the QR.                                                 |
| `eyeBall`   | string   | `"ball14"`   | Inner eye style of the QR.                                                 |
| `bodyColor` | hex code | `#000000`    | Color of the QR body.                                                      |
| `bgColor`   | hex code | `#ffffff`    | Background color of the QR code.                                           |

---

## ✅ Example Usage

### With default styles and logo

```
GET /api/qr?data=https://example.com
```

### Custom colors and no logo

```
GET /api/qr?data=HelloWorld&bodyColor=%23ff5733&bgColor=%23000000&nologo=true
```

---

## 🎨 QR Customization Styles

You can customize your QR using the following style options:

### Body Styles
- `circular`, `square`, `rounded`, `dot`, `extra-rounded`, etc.

### Eye Styles
- `frame0` to `frame14`

### EyeBall Styles
- `ball0` to `ball14`

> For the full list, check: [QRCode Monkey Styles](https://www.qrcode-monkey.com/qr-code-styling)

---

## 🧠 How It Works

This API sends a `POST` request to the official QRCode Monkey endpoint:

```js
POST https://api.qrcode-monkey.com/qr/custom
```

Payload includes:
- Data to encode
- Customization config
- Optional logo
- PNG output (300px)

Returns: A ready-to-use PNG QR code image.

---

## 🚫 Error Responses

| Status | Message                     | Description                        |
|--------|-----------------------------|------------------------------------|
| 400    | Missing 'data'              | No data parameter was provided.    |
| 405    | Method not allowed          | Only `GET` requests are supported. |
| 500    | QR generation failed        | Internal or external API failure.  |

---

## 🧪 Sample Output

![Sample QR](https://raw.githubusercontent.com/sanjay434343/My-qr-api/main/sample.png)

---

## 📦 Deployment

This API can be deployed easily on **Vercel** or any Node-compatible platform.

> Place this file at: `/api/qr.js` for Vercel.

---

## 👨‍💻 Author

**Sanjay**  
📍 Pollachi, Coimbatore, India  
🚀 [GitHub](https://github.com/sanjay434343)

---

## 📝 License

This project is open-source and free to use under the MIT license.
