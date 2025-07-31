# 🎯 Custom QR Code API

This is a **simple and customizable** QR Code generator API built using Node.js. It supports optional logo embedding and full visual customization via query parameters.

---

## 🔗 Live API Endpoint

```
GET https://my-qr-api.vercel.app/api/qr
```

---

## ⚙️ Query Parameters

| Parameter   | Type     | Default      | Description                                                                 |
|-------------|----------|--------------|-----------------------------------------------------------------------------|
| `data`      | string   | **required** | The content to encode in the QR code (URL, text, etc).                     |
| `nologo`    | boolean  | false        | If set to `"true"`, logo will be removed from the center.                  |
| `body`      | string   | `"circular"` | QR body style (see full list below).                                       |
| `eye`       | string   | `"frame12"`  | Outer eye style (from `0` to `16`).                                        |
| `eyeBall`   | string   | `"ball14"`   | Inner eye style (from `0` to `19`).                                        |
| `bodyColor` | hex code | `#000000`    | Color of the QR body.                                                      |
| `bgColor`   | hex code | `#ffffff`    | Background color of the QR code.                                           |

---

## ✅ Example Usage

### 🔘 With default styles and logo

```
/api/qr?data=https://example.com
```

[▶️ Preview QR with Logo](https://my-qr-api.vercel.app/api/qr?data=https://example.com)

---

### 🔘 Without logo (nologo)

```
/api/qr?data=HelloWorld&nologo=true
```

[▶️ Preview QR without Logo](https://my-qr-api.vercel.app/api/qr?data=HelloWorld&nologo=true)

---

### 🔘 Custom colors and styles

```
/api/qr?data=HelloWorld&bodyColor=%23ff5733&bgColor=%23000000&eye=2&eyeBall=2&body=dot
```

[▶️ Preview Custom QR](https://my-qr-api.vercel.app/api/qr?data=HelloWorld&bodyColor=%23ff5733&bgColor=%23000000&eye=2&eyeBall=2&body=dot)

---

## 🎨 QR Customization Styles

### 🧩 `body` Styles

```
square  
mosaic  
dot  
circle  
circle-zebra  
circle-zebra-vertical  
circular  
edge-cut  
edge-cut-smooth  
japnese  
leaf  
pointed  
pointed-edge-cut  
pointed-in  
pointed-in-smooth  
pointed-smooth  
round  
rounded-in  
rounded-in-smooth  
rounded-pointed  
star
```

### 👁️ `eye` Styles

Use values from:

```
0 to 16
```

Example: `eye=0`, `eye=12`, `eye=16`

### 👁️‍🗨️ `eyeBall` Styles

Use values from:

```
0 to 19
```

Example: `eyeBall=0`, `eyeBall=14`, `eyeBall=19`

---

## 🚫 Error Responses

| Status | Message                     | Description                        |
|--------|-----------------------------|------------------------------------|
| 400    | Missing 'data'              | No data parameter was provided.    |
| 405    | Method not allowed          | Only `GET` requests are supported. |
| 500    | QR generation failed        | Internal API failure.              |

---

## 📦 Deployment

This API can be deployed easily on **Vercel** or any Node-compatible server.

> Place this file at: `/api/qr.js` for Vercel.

---

## 👨‍💻 Author

**Sanjay**  
📍 Pollachi, Coimbatore, India  
🚀 [GitHub](https://github.com/sanjay434343)

---

## 📝 License

This project is open-source and free to use under the MIT license.
