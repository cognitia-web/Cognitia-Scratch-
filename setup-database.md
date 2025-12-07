# Database Setup Instructions

## Option 1: Local PostgreSQL (Recommended for Development)

1. **Install PostgreSQL** (if not already installed):
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Create Database**:
   ```bash
   # Start PostgreSQL service
   # Windows: Start PostgreSQL service from Services
   # Mac/Linux: brew services start postgresql or sudo systemctl start postgresql
   
   # Create database
   psql -U postgres
   CREATE DATABASE cognitia_db;
   \q
   ```

3. **Update .env file**:
   ```
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/cognitia_db?schema=public"
   ```

## Option 2: Supabase (Free Cloud PostgreSQL)

1. Go to https://supabase.com
2. Create a free account and project
3. Go to Project Settings > Database
4. Copy the connection string
5. Update .env file with the connection string

## Option 3: Railway/Render (Free Tier)

1. Go to https://railway.app or https://render.com
2. Create a PostgreSQL database
3. Copy the connection string
4. Update .env file

## After Database Setup

Run these commands:

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate
```

Then start the app:
```bash
npm run dev
```


