# Medicine Inventory

A full-stack medicine inventory management application with a **React + Vite frontend** and a **Node.js + Express + MongoDB backend**.

🌐 Live app: https://medicine-inventory-ten.vercel.app

---

## 📦 Repository Structure

```bash
Medicine-Inventory/
├── backend/                  # Express API + MongoDB integration
│   ├── .env.example
│   ├── server.js
│   ├── package.json
│   ├── mongodb/
│   │   ├── connect.js
│   │   └── model/
│   └── router/
│       ├── ai/
│       ├── dispense/
│       ├── get/
│       └── post/
└── medisys/                  # React frontend (Vite)
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── eslint.config.js
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── assets/
        ├── components/
        ├── context/
        ├── hooks/
        ├── pages/
        └── utils/
```

---

## 🧰 Tech Stack

### Frontend (`medisys`)
- React
- Vite
- JavaScript
- CSS

### Backend (`backend`)
- Node.js
- Express
- MongoDB (via custom connection setup)

### Language Composition (Repository)
- JavaScript: **79.5%**
- CSS: **20.1%**
- HTML: **0.4%**

---

## ✨ Core Features

- Manage medicine inventory records
- Create/add medicine entries
- Fetch and display medicine data
- Dispense/reduce medicine stock
- Organized frontend architecture (`components`, `pages`, `hooks`, `context`, `utils`)
- Modular backend route grouping (`get`, `post`, `dispense`, `ai`)

---

## 🤖 AI-Assisted Inventory Summary

The system includes an **AI-assisted inventory summary** feature to help users quickly understand stock status and inventory health.

### What it does
- Summarizes current inventory levels in a readable format
- Highlights potential low-stock items
- Helps identify restocking priorities
- Provides quick insights for decision-making

### Where it lives
- Backend AI routes are organized under:
  - `backend/router/ai/`

### How it works (high-level)
1. Inventory data is collected from the database.
2. The backend AI route processes and formats the dataset.
3. A summary response is generated and returned to the frontend.
4. The frontend displays the generated summary for the user.

### Notes
- AI output is assistive and should be reviewed before making critical inventory decisions.
- You can extend this feature with:
  - expiry-focused summaries
  - weekly usage trend summaries
  - reorder recommendations

---

## ⚙️ Local Development Setup

### 1) Clone the repository

```bash
git clone https://github.com/JeraldEstrella/Medicine-Inventory.git
cd Medicine-Inventory
```

### 2) Setup backend

```bash
cd backend
npm install
```

Create your environment file from the sample:

```bash
cp .env.example .env
```

Update `.env` with your actual values (MongoDB URI, port, and any API keys your routes require).

Start backend server:

```bash
npm run dev
```

> If `npm run dev` is not available in your `package.json`, use:
>
> ```bash
> npm start
> ```
> or
> ```bash
> node server.js
> ```

### 3) Setup frontend

Open a new terminal:

```bash
cd medisys
npm install
npm run dev
```

Then open the Vite local URL (typically `http://localhost:5173`).

---

## 🔌 Backend Overview

### `backend/server.js`
Main server entry point. Typically responsible for:
- Initializing Express app
- Applying middleware (JSON parsing, CORS, etc.)
- Registering route modules
- Connecting backend logic with MongoDB utilities
- Starting the API server

### `backend/mongodb/connect.js`
Database connection setup for MongoDB.

### `backend/mongodb/model/`
Contains database model definitions/schemas used by route handlers.

### `backend/router/`
Feature-based API routes:
- `get/` → read/fetch operations
- `post/` → create/insert operations
- `dispense/` → dispense-related stock updates
- `ai/` → AI-related endpoints (inventory summary and related logic)

---

## 🖥️ Frontend Overview

### `medisys/src/main.jsx`
React app bootstrap/entry file.

### `medisys/src/App.jsx`
Top-level app component and likely global routing/layout composition.

### `medisys/src/components/`
Reusable UI components.

### `medisys/src/pages/`
Page-level views/screens.

### `medisys/src/context/`
Shared app state using React Context.

### `medisys/src/hooks/`
Custom React hooks.

### `medisys/src/utils/`
Helper utilities and shared functions.

### `medisys/src/index.css`
Global styling.

### `medisys/public/`
Static assets such as icons and favicon.

---

## 🔐 Environment Variables

The backend includes `.env.example`. Create a `.env` in `backend/` and add required keys.

Example shape (adjust to your actual keys):

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

If AI routes are used, add corresponding API credentials in `.env` as needed.

---

## 🧪 Scripts

Run these inside each project folder.

### Backend (`/backend`)
- `npm install` – install dependencies
- `npm run dev` / `npm start` – run API server

### Frontend (`/medisys`)
- `npm install` – install dependencies
- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview production build locally

---

## 🚀 Deployment Notes

- Frontend is deployable on Vercel/Netlify (already live on Vercel).
- Backend can be deployed on platforms like Render/Railway/Fly.io.
- Ensure CORS and API base URL are configured correctly between frontend and backend.
- Keep secrets in deployment environment variables, not in source code.

---

## 📈 Suggested Improvements

- Add authentication/authorization (admin/staff roles)
- Add low-stock and expiry alerts
- Add audit log for stock movements
- Add tests (unit/integration)
- Add API documentation (Postman collection or Swagger/OpenAPI)
- Add Docker support for full-stack local run

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit:
   ```bash
   git commit -m "feat: add your feature"
   ```
4. Push:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a Pull Request

---

## 👤 Author

**Jerald Estrella**  
GitHub: [@JeraldEstrella](https://github.com/JeraldEstrella)

---

## 📄 License

No license file is currently present.  
Consider adding an open-source license (e.g., MIT) to clarify usage rights.
