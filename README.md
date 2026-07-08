# ✂️ Sniply — URL Shortener

A fast and modern URL shortener built with **Node.js**, **Express**, and **MongoDB Atlas**. Shorten long URLs instantly and track real-time analytics on every click.

🔗 **Live Demo:** [https://url-shortener-8yhr.onrender.com](https://url-shortener-8yhr.onrender.com)

---

## 🚀 Features

- ⚡ Instantly shorten any long URL
- 📋 One-click copy to clipboard
- 📊 Real-time analytics — track total clicks & visit history
- 🎨 Bitly-inspired modern dark UI
- 📱 Fully responsive — works on mobile & desktop
- ⌨️ Keyboard friendly — `Enter` to shorten, `Esc` to close modal

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Frontend | HTML, CSS, Vanilla JS |
| Hosting | Render |
| Short ID | nanoid / shortid |

---

## 📁 Project Structure

```
url-shortener/
├── controllers/
│   └── url.js          # URL shortening logic
├── models/
│   └── url.js          # Mongoose schema
├── routes/
│   └── url.js          # API routes
├── public/
│   ├── index.html      # Frontend UI
│   ├── style.css       # Styles
│   └── app.js          # Frontend logic
├── connect.js          # MongoDB connection
├── index.js            # Entry point
├── package.json
└── .env                # Environment variables (not pushed)
```

---

## ⚙️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/url` | Shorten a URL |
| `GET` | `/:shortId` | Redirect to original URL |
| `GET` | `/url/analytics/:shortId` | Get click analytics |

### Example — Shorten a URL
```bash
POST /url
Content-Type: application/json

{
  "url": "https://www.example.com/very/long/url"
}
```

### Response
```json
{
  "id": "abc123"
}
```

---

## 🏃 Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/url-shortener.git
cd url-shortener
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create a `.env` file
```env
MONGO_URL=your_mongodb_atlas_connection_string
PORT=8001
```

### 4. Start the development server
```bash
npm run dev
```

Visit **http://localhost:8001** in your browser.

---

## ☁️ Deployment

This project is deployed on **[Render](https://render.com)** with **MongoDB Atlas** as the database.

### Environment Variables on Render:
| Key | Value |
|-----|-------|
| `MONGO_URL` | Your MongoDB Atlas connection string |

---

## 📄 License

This project is open source and available under the [ISC License](LICENSE).
