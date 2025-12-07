# Cognitia - Modern Student Study App

A full-stack Next.js application featuring glassmorphism UI design, AI-powered study assistance, habit tracking, workout verification, guardian system, and reward mechanisms - all with strict ethical and privacy compliance.

## Features

### Core Features
- **AI Study Assistant**: Chat interface, exam planner, flashcards with spaced repetition
- **Task & Habit System**: Drag-and-drop task management with streak tracking
- **Workout Tracking**: Pose estimation verification, Indian food calorie database
- **Life Skill Courses**: Course library with progress tracking and certificates
- **Guardian System**: OTP-based linking with privacy-safe daily reports
- **Focus Tools**: Pomodoro timer, ambient sounds, distraction-free mode
- **Reward System**: Points earning with Stripe payouts and KYC flows

### Privacy & Security
- AES-256 encryption for all videos
- Auto-delete videos after 30 days
- GDPR/COPPA/DPDP compliance
- Data export and deletion options
- On-device pose detection (MediaPipe)
- Manual video recording only (≤30s)

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion, ShadCN/UI, animejs
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js
- **ML/AI**: MediaPipe (on-device), OpenAI API (optional)
- **Payments**: Stripe
- **Storage**: Encrypted file storage

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Cognitia-Scratch-
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Fill in your environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random secret for NextAuth
- `NEXTAUTH_URL`: Your app URL
- `ENCRYPTION_KEY`: 32-byte encryption key
- `STRIPE_SECRET_KEY`: Stripe secret key (optional)
- `OPENAI_API_KEY`: OpenAI API key (optional)

4. Set up the database
```bash
npx prisma generate
npx prisma migrate dev
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes
│   ├── (dashboard)/       # Protected routes
│   ├── api/               # API routes
│   └── layout.tsx
├── components/
│   ├── ui/                # ShadCN components
│   ├── glass/             # Glassmorphism components
│   ├── layout/            # Layout components
│   └── verification/      # Verification components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities
│   ├── db/               # Database client
│   ├── encryption/       # AES-256 encryption
│   ├── mediapipe/        # Pose detection
│   └── stripe/            # Payment integration
├── prisma/                # Database schema
└── public/                # Static assets
```

## Key Features Implementation

### Glassmorphism Design
All UI components use glassmorphism with:
- Frosted glass effect (`backdrop-blur-xl`)
- Semi-transparent backgrounds (`bg-white/25`)
- Subtle borders and shadows
- Smooth transitions

### Video Verification
- Manual recording start (user must click)
- Maximum 30 seconds duration
- On-device MediaPipe pose detection
- Randomized liveness prompts
- SHA-256 hashing for duplicate prevention
- AES-256 encryption before storage
- Auto-delete after 30 days

### Guardian System
- OTP-based linking (no ID uploads)
- Daily reports with only non-sensitive data:
  - Study time
  - Tasks completed
  - Streaks
  - Upcoming exams
- No access to videos or private behavior

### Reward System
- Points earned for verified tasks
- 100 points = $1.00 USD
- Stripe integration for payouts
- KYC required for amounts over $100
- Transparent reward history

## Privacy Compliance

- **GDPR**: Full data export and deletion
- **COPPA**: Age verification and guardian consent for <16
- **DPDP**: Data minimization and encryption
- **Ethical**: No continuous monitoring, manual recording only

## License

MIT

