# Deploying LAGOS-CBT with Supabase + Vercel / Netlify

This guide explains how to deploy the **Lagos State Civil Service Commission (CSC) Promotion Examination Platform** using **Supabase** (PostgreSQL in the cloud) and **Vercel** or **Netlify**.

---

## 🌟 Why Supabase + Vercel is the Perfect Match

By using **Supabase** as your cloud database:
- **Zero server management**: Your database lives in the cloud on Supabase's high-speed PostgreSQL engine.
- **Permanent storage**: Candidate registrations, questions, exam timers, autosaved responses, and official merit rosters are preserved permanently.
- **1-Click Vercel / Netlify Hosting**: Vercel serves the React UI via global edge CDN and automatically runs the `/api` backend as serverless functions.
- **100% Free**: Both Supabase and Vercel have generous free tiers.

---

## Step 1: Create your Free Supabase Database

1. Go to **[supabase.com](https://supabase.com)** and sign in (or sign up with GitHub).
2. Click **New Project**:
   - **Name**: `lagos-cbt`
   - **Database Password**: Set a strong password (save it safely)
   - **Region**: Choose the closest region (e.g. `West Europe (London)` or `East US`)
3. Click **Create new project** and wait ~1 minute for it to provision.

---

## Step 2: Create Database Tables with the SQL Script

1. In your Supabase dashboard, click **SQL Editor** on the left menu (icon looks like `>_`).
2. Click **New query**.
3. Open the file [supabase/schema.sql](file:///c:/Users/Administrator/Desktop/Ademayowa/Projects/Promotion/supabase/schema.sql) in this repository, copy its entire contents, and paste it into the Supabase SQL editor.
4. Click **Run** (or press `Ctrl + Enter`).
5. You will see `Success. No rows returned`. All tables (`users`, `tokens`, `categories`, `questions`, `resources`, `exams`) and indexes are now created!

---

## Step 3: Copy your Supabase API Credentials

1. In Supabase, click **Project Settings** (gear icon at the bottom of the left sidebar).
2. Navigate to **API** under Configuration.
3. Note two values:
   - **Project URL**: e.g., `https://xyzabcdefghijklmnopq.supabase.co`
   - **service_role secret key**: click *Reveal* and copy the `service_role` key (starts with `eyJ...`).
     *(Note: Always use the `service_role` key in backend environment variables so the exam engine can securely manage sessions and exams).*

---

## Step 4: Deploy to Vercel (Recommended)

1. Push your project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Lagos CBT Promotion Platform with Supabase"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/lagos-cbt.git
   git push -u origin main
   ```

2. Go to **[vercel.com](https://vercel.com)** and sign in.
3. Click **Add New...** → **Project**, and select your `lagos-cbt` repository.
4. Vercel automatically detects **Vite**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand the **Environment Variables** section and add:
   | Key | Value |
   | --- | --- |
   | `SUPABASE_URL` | Your Supabase Project URL (`https://xyz...supabase.co`) |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase `service_role` secret key |
   | `ADMIN_PASSWORD` | `admin2027` (or your private Commission password) |
6. Click **Deploy**.

Vercel will build the frontend and deploy the serverless API. In ~45 seconds, your website will be **LIVE** with a public URL like `https://lagos-cbt.vercel.app`!

---

## Step 5: (Optional) Local Development with Supabase

If you want to run the server on your local machine connected to Supabase:
1. Create a `.env` file in the root directory (copied from [.env.example](file:///c:/Users/Administrator/Desktop/Ademayowa/Projects/Promotion/.env.example)):
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ADMIN_PASSWORD=admin2027
   PORT=3001
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
   The platform will connect directly to your Supabase cloud database!
   *(Note: If no Supabase URL is provided, the server automatically uses local SQLite `cbt.db` as a fallback).*

---

## Verification & Testing After Deployment

1. **Open your live URL** (e.g. `https://lagos-cbt.vercel.app`).
2. **Test Demo Mode**: Click *Demo Mode* and launch any candidate account (e.g., *Babatunde Olatunji* or *Mrs. Ngozi Eze*).
3. **Test Admin Access**: Sign in with:
   - Username: `admin`
   - Password: The `ADMIN_PASSWORD` you configured (default: `admin2027`).
4. **Inspect Supabase**: Go to the **Table Editor** on your Supabase dashboard to watch registered candidates, active exams, and completed merit scores update in real-time!
