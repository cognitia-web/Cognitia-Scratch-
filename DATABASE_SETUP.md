# Database Setup - Choose One Option

## 🚀 Option 1: Supabase (Recommended - 2 minutes)

1. Go to https://supabase.com
2. Click "Start your project" → Sign up (free)
3. Click "New Project"
4. Fill in:
   - Name: `cognitia` (or any name)
   - Database Password: (choose a strong password, save it!)
   - Region: Choose closest to you
5. Wait ~2 minutes for project to be created
6. Go to **Project Settings** (gear icon) → **Database**
7. Scroll to **Connection string** → Copy the **URI** (starts with `postgresql://...`)
8. Open `.env` file in this project
9. Replace the `DATABASE_URL` line with:
   ```
   DATABASE_URL="paste_your_supabase_connection_string_here"
   ```
10. Save the file
11. Run: `npm run db:migrate`
12. Done! ✅

## 🖥️ Option 2: Local PostgreSQL

1. Download PostgreSQL: https://www.postgresql.org/download/windows/
2. Install (remember the password you set for `postgres` user)
3. Open pgAdmin or command line
4. Create database:
   ```sql
   CREATE DATABASE cognitia_db;
   ```
5. Update `.env`:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/cognitia_db?schema=public"
   ```
6. Run: `npm run db:migrate`

## ☁️ Option 3: Railway (Free Tier)

1. Go to https://railway.app
2. Sign up (free)
3. Click "New Project" → "Add PostgreSQL"
4. Click on the PostgreSQL service → "Variables" tab
5. Copy the `DATABASE_URL`
6. Paste in `.env` file
7. Run: `npm run db:migrate`

---

**After setting up database, run:**
```bash
npm run db:migrate
npm run dev
```


