# AI Productivity Companion ✨

A full-stack productivity web application that helps users organize their tasks, events, and notes with AI assistance and smart notifications.

## Features

### 🚀 Core Productivity
- **Task Management**: Create, track, and manage daily tasks with priority, deadlines, and subtasks.
- **Calendar Integration**: View and manage events from Google Calendar.
- **Note-Taking**: Capture quick notes and ideas with markdown support.
- **Habit Tracking**: Build positive habits with streak tracking and reminders.

### 🤖 AI Assistance
- **Smart Summaries**: Generate summaries for your tasks and notes using Gemini AI.
- **Idea Generation**: Get AI-powered suggestions for new tasks and projects.
- **Automated Planning**: Smart scheduling and prioritization.

### 🔔 Smart Notifications
- **Email Notifications**: Get important updates delivered to your inbox.
- **Real-time Alerts**: In-app notifications for upcoming tasks and events.
- **Scheduled Jobs**: Automated job system for reminders and cleanups.

### 🎨 Modern Interface
- **Dashboard**: Overview of your day with quick actions.
- **Dark Mode**: Built-in support for dark and light themes.
- **Responsive Design**: Seamless experience across desktop and mobile devices.

## Tech Stack

### Frontend
- **Next.js 16** - React framework with TypeScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Recharts** - Charting library

### Backend
- **Next.js API Routes** - Serverless backend
- **TypeScript** - Type safety
- **Mongoose** - MongoDB ODM
- **Google Calendar API** - Calendar integration

### AI & Automation
- **Groq API** - AI-powered features
- **Agenda** - Cron-like job scheduler

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-productivity-companion
   ```

2. **Install dependencies**
   ```bash
   cd ai-productivity-companion
   npm install
   ```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Next.js
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

# Google Authentication
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Google Calendar
GOOGLE_CREDENTIALS_PATH=./google-calendar-credentials.json

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Database
MONGODB_URI=your_mongo_db_uri

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
SMTP_TO=your_email@example.com
SMTP_FROM=your_email@gmail.com
```

## Usage

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Start
```bash
npm run start
```

## Project Structure

```
ai-productivity-companion/
├── app/                    # Next.js application pages
├── components/             # Reusable React components
├── lib/                    # Utility functions and helpers
├── services/               # External service integrations
├── types/                  # TypeScript type definitions
└── .env.local              # Environment variables
```
