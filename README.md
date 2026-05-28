# AI Mentor Dashboard

A modern dark SaaS dashboard for generating technical career roadmaps, daily learning missions, mentor chat responses, bookmarks, visual skill paths, interview prep, and gamified progress tracking.

## Run

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## Groq Setup

Create a `.env` file in the project root:

```bash
GROQ_API_KEY=your_key_here
PORT=3000
```

Without a Groq API key, the roadmap and mission flows still use built-in fallback content, while mentor chat shows a visible configuration error instead of pretending to be AI.

## Features

- Search any technical career role
- Explore supported roles and trending roadmap cards
- Generate phased beginner-to-advanced roadmaps with role overview, demand, salary insight, tools, projects, resources, FAQs, portfolio guidance, and interview prep
- View connected roadmap nodes inspired by roadmap.sh
- Generate daily missions from role and progress
- Chat with a supportive AI mentor
- Track XP, levels, streaks, achievement badges, completed missions, bookmarks, and roadmap progress in `localStorage`
- Responsive dark SaaS dashboard UI
