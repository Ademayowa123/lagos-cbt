# Deployment Guide for LAGOS-CBT

This guide explains how to publish the **Lagos State Civil Service Promotion Examination CBT Platform** to the public internet so candidates and commissioners can access it from any computer, tablet, or phone.

---

## ⚠️ Important Note: Vercel / Netlify vs. Fullstack Hosting

The app now has two interconnected parts:
1. **Frontend (UI)**: Built with React & Vite (`/dist`).
2. **Backend Engine**: A Node.js server (`server/server.js`) with an embedded SQLite database (`server/data/cbt.db`) that handles:
   - Live candidate registrations & password security
   - Server-enforced exam countdown timers (preventing tampering with device clocks)
   - Real-time question autosaving
   - Single-active-session kickout enforcement
   - Official question bank and merit roster generation

> **Why Vercel or Netlify alone is not recommended for the database:**
> Vercel and Netlify are **stateless/serverless** hosts. Their filesystems are temporary and reset on every restart or cold start. If SQLite runs on a serverless function, **candidate accounts and exam progress would be lost when the function sleeps**.
>
> **The two practical ways to deploy:**
> - **Option 1 (Recommended — Easiest & 100% Free/Low Cost):** Deploy everything to **Render.com** or **Railway.app**. It runs both the frontend and backend in one place with a persistent database disk.
> - **Option 2 (Split Setup):** Host the frontend on **Vercel** or **Netlify**, and host the backend on **Render** or **Railway**.

---

## Option 1: Deploy Everything to Render.com (Recommended)

Render gives you a free/cheap public HTTPS URL (e.g., `https://lagos-cbt.onrender.com`) and supports persistent storage so candidate data is never wiped.

### Step 1: Push your code to GitHub
Make sure your project is pushed to a GitHub repository:
```bash
git init
git add .
git commit -m "Lagos CBT Year 2027 Promotion Suite"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/lagos-cbt.git
git push -u origin main
```

### Step 2: Create a Web Service on Render
1. Go to [Render.com](https://render.com) and sign in (with GitHub).
2. Click **New +** → **Web Service**.
3. Select your `lagos-cbt` repository.
4. Fill in the following settings:
   - **Name**: `lagos-cbt` (or your preferred name)
   - **Region**: Frankfurt (EU) or Oregon (US)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `node server/server.js`

### Step 3: Add Environment Variables
Under the **Environment Variables** section on Render, add:
- `NODE_VERSION` = `22.5.0` (required for built-in SQLite support)
- `ADMIN_PASSWORD` = `YourChosenAdminPassword2027!` (set your private admin password)
- `PORT` = `3001` (or leave default, Render automatically injects PORT)

### Step 4: (Recommended) Add a Persistent Disk
To ensure your SQLite database (`cbt.db`) is permanently saved across server restarts:
1. In the service settings, go to the **Disks** tab.
2. Click **Add Disk**:
   - **Name**: `cbt-data`
   - **Mount Path**: `/var/data`
   - **Size**: `1 GB` (free or $0.25/mo)
3. Under Environment Variables, add:
   - `DB_PATH` = `/var/data/cbt.db`

### Step 5: Click "Create Web Service"
Render will build the app and launch it. Once the deployment says **Live**, click the URL at the top to access your website publicly!

---

## Option 2: Frontend on Vercel + Backend on Render/Railway

If you already love Vercel and want your domain on Vercel (e.g. `lagos-cbt.vercel.app`), use this split setup.

### Step A: Deploy the Backend to Render or Railway
Follow the steps in **Option 1** to get a public backend URL, for example:
`https://lagos-cbt-api.onrender.com`

### Step B: Connect Vercel to your GitHub repository
1. Go to [Vercel.com](https://vercel.com) and click **Add New...** → **Project**.
2. Select your `lagos-cbt` GitHub repository.
3. In **Project Settings**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add:
   - `VITE_API_URL` = `https://lagos-cbt-api.onrender.com` (your backend URL from Step A)
5. Click **Deploy**.

Vercel will build and host your frontend at `https://your-project.vercel.app`. The pre-configured [vercel.json](file:///c:/Users/Administrator/Desktop/Ademayowa/Projects/Promotion/vercel.json) file already handles SPA routing so candidate pages and dashboard links reload smoothly.

---

## Option 3: Deploying on Railway.app

1. Go to [Railway.app](https://railway.app) and sign in with GitHub.
2. Click **New Project** → **Deploy from GitHub repo** → select `lagos-cbt`.
3. Go to **Settings**:
   - **Build Command**: `npm run build`
   - **Start Command**: `node server/server.js`
4. Go to **Variables**:
   - `NODE_VERSION`: `22.5.0`
   - `ADMIN_PASSWORD`: `YourAdminPassword2027`
5. Go to **Networking** → Click **Generate Domain** (gives you a public URL like `lagos-cbt.up.railway.app`).

---

## Post-Deployment Checklist

Once deployed:
1. **Visit the public URL**: Confirm the homepage loads with the Lagos State Civil Service Commission emblem.
2. **Test Demo Mode**: Click *Demo Mode* and launch any of the three GL 06–16 mock candidate accounts.
3. **Test Admin Login**: Sign in with username `admin` and your chosen `ADMIN_PASSWORD` to verify access to the Administrator Suite, question bank, and merit roster.
4. **Test Candidate Registration**: Register a new candidate account to verify that usernames and service numbers generate cleanly.
