# 🚀 Deployment Guide for Render.com

## 1. Prerequisites (Do this FIRST)
1.  **MongoDB Atlas**: You need a cloud database.
    *   Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
    *   Create a Cluster (Free Sandbox).
    *   Get your connection string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/...`
    *   **Allow Access from Anywhere**: Go to Network Access -> Add IP Address -> `0.0.0.0/0`. (Crucial for Render to connect).

## 2. Deploy Server (Backend)
1.  Go to Render Dashboard -> **New +** -> **Web Service**.
2.  Connect your GitHub Repository.
3.  **Settings:**
    *   **Name:** `movie-tracker-server` (or similar)
    *   **Root Directory:** `server`
    *   **Runtime:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `node server.js`
4.  **Environment Variables (Scroll down):**
    *   `MONGO_URI` = (Your MongoDB Atlas connection string)
    *   `JWT_SECRET` = (Any secret password you want)
    *   `TMDB_API_KEY` = (Your TMDB API Key)
    *   `PORT` = `5000` (Optional, Render sets one automatically, but good to have)

## 3. Deploy Client (Frontend)
1.  Go to Render Dashboard -> **New +** -> **Static Site**.
2.  Connect your GitHub Repository.
3.  **Settings:**
    *   **Name:** `movie-tracker-client`
    *   **Root Directory:** `client`
    *   **Build Command:** `npm run build`
    *   **Publish Directory:** `dist`
4.  **Environment Variables:**
    *   `VITE_API_URL` = (The URL of your Server from Step 2, e.g., `https://movie-tracker-server.onrender.com/api`)
    *   **IMPORTANT:** Do NOT include the trailing slash `/` after `/api`.
5.  **⚠️ CRITICAL STEP: FIX REFRESH 404s**
    *   Go to the **Redirects/Rewrites** tab for your Static Site.
    *   Add a new Rule:
        *   **Source:** `/*`
        *   **Destination:** `/index.html`
        *   **Action:** `Rewrite`
    *   *Why?* Without this, if you go to `/login` and refresh the page, you will get a "Not Found" error.

## 4. Presentation Day Tips 🎓
*   **Wake it up:** The free tier on Render "sleeps" after 15 minutes of inactivity.
*   **Action:** 2 minutes before your presentation starts, open your deployed URL on your phone to wake up the server. It will take ~60 seconds to load the first time.
