# Quick Start Guide

## Step 1: Set Up Database

You have 3 options (choose one):

### Option A: Supabase (Easiest - Free)
1. Go to https://supabase.com
2. Sign up (free)
3. Create a new project
4. Go to **Project Settings > Database**
5. Copy the **Connection string** (URI format)
6. Paste it in `.env` as `DATABASE_URL`

### Option B: Local PostgreSQL
1. Install PostgreSQL: https://www.postgresql.org/download/
2. Create database:
   ```sql
   psql -U postgres
   CREATE DATABASE cognitia_db;
   \q
   ```
3. Update `.env`:
   ```
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/cognitia_db?schema=public"
   ```

### Option C: Railway (Free Tier)
1. Go to https://railway.app
2. Sign up (free)
3. Create new project > Add PostgreSQL
4. Copy connection string
5. Paste in `.env` as `DATABASE_URL`

## Step 2: Create .env File

Run the setup script:
```powershell
.\setup.ps1
```

Or manually create `.env` file with:
```
DATABASE_URL="your_postgresql_connection_string_here"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any-random-string-here"
ENCRYPTION_KEY="any-32-character-string-here"
```

## Step 3: Run Database Migrations

```bash
npm run db:migrate
```

This will create all the database tables.

## Step 4: Start the App

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## Troubleshooting

**Database connection error?**
- Make sure PostgreSQL is running
- Check your DATABASE_URL in `.env`
- Verify database exists

**Migration errors?**
- Make sure database is accessible
- Check DATABASE_URL format
- Ensure you have proper permissions

