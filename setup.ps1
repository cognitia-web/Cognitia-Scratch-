# Cognitia Setup Script
Write-Host "Setting up Cognitia Study App..." -ForegroundColor Green

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    
    # Generate a random secret for NextAuth
    $nextAuthSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    
    # Generate encryption key (32 bytes)
    $encryptionKey = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    
    $envContent = @"
# Database
# IMPORTANT: Update this with your PostgreSQL connection string
# Options:
# 1. Local: postgresql://postgres:password@localhost:5432/cognitia_db
# 2. Supabase: Get from https://supabase.com (free tier available)
# 3. Railway: Get from https://railway.app (free tier available)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cognitia_db?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$nextAuthSecret"

# Encryption
ENCRYPTION_KEY="$encryptionKey"

# Optional: Add other keys as needed
OPENAI_API_KEY=""
STRIPE_SECRET_KEY=""
"@
    
    $envContent | Out-File -FilePath .env -Encoding utf8
    Write-Host ".env file created!" -ForegroundColor Green
    Write-Host "IMPORTANT: Update DATABASE_URL with your PostgreSQL connection string" -ForegroundColor Red
} else {
    Write-Host ".env file already exists" -ForegroundColor Yellow
}

# Generate Prisma Client
Write-Host "Generating Prisma Client..." -ForegroundColor Yellow
npm run db:generate

# Check if database is accessible
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Set up PostgreSQL database:" -ForegroundColor White
Write-Host "   - Install PostgreSQL (https://www.postgresql.org/download/)" -ForegroundColor Gray
Write-Host "   - Or use Supabase (https://supabase.com) - free tier available" -ForegroundColor Gray
Write-Host "   - Or use Railway (https://railway.app) - free tier available" -ForegroundColor Gray
Write-Host "2. Update DATABASE_URL in .env file" -ForegroundColor White
Write-Host "3. Run: npm run db:migrate" -ForegroundColor White
Write-Host "4. Run: npm run dev" -ForegroundColor White


