# We Are Losing - Death Journal & Run Log

A community tool for players of "We Are Losing" to submit and share their runs, get AI-generated roasts, and comment on others' spectacular defeats and victories.

## Features

### ✅ Implemented
- **Run Submission Form** - Players can submit detailed run data including:
  - Boss encountered
  - Items used
  - Player stats (HP, ATK, DEF, SPD)
  - Outcome (Victory/Defeat)
  - Death reason (for defeats)
  - Optional notes

- **Individual Run Pages** - Each run gets its own shareable page with:
  - Boss card with difficulty rating
  - Player stats visualization
  - Item list with rarity colors
  - Outcome badge
  - Comments section
  - Social sharing buttons

- **Global Run Feed** - Browse all runs with:
  - Filtering by boss and outcome
  - Sorting options (newest, oldest, most comments, deadliest)
  - Responsive card layout
  - Load more pagination

- **Comments System** - Community engagement with:
  - Optional anonymous comments
  - Real-time comment posting
  - Timestamp display

- **Social Sharing** - Share runs via:
  - Twitter intent URLs
  - Discord-formatted text
  - Direct link copying
  - OpenGraph meta tags for rich previews

- **AI-Generated Roasts** - Powered by OpenAI:
  - Automatic roast generation for new runs
  - Manual roast generation button for existing runs
  - Different roast styles for victories vs defeats
  - Fallback roasts if API is unavailable

### 🔮 Future Features (Not Yet Implemented)
- User accounts and authentication
- Leaderboards and statistics
- Run tagging system
- Voting on funniest roasts

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes
- **Data Storage**: JSON files (MVP - can be upgraded to Supabase later)
- **Styling**: Tailwind CSS with dark horror theme

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```
Then edit `.env.local` and add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Getting an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Create a new API key
4. Add it to your `.env.local` file

**Note**: AI roasts will use fallback messages if no API key is provided.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── runs/              # Run pages
│   ├── submit/            # Run submission form
│   └── page.tsx           # Home page
├── components/            # Reusable React components
├── data/                  # Game data and JSON storage
├── lib/                   # Utility functions and storage logic
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## Sample Data

The app comes with sample runs and comments to demonstrate functionality. You can find them in:
- `data/runs.json` - Sample run submissions
- `data/comments.json` - Sample comments
- `data/gameData.ts` - Boss and item definitions

## API Endpoints

- `GET /api/runs` - Fetch runs with filtering and sorting
- `POST /api/runs` - Submit a new run
- `GET /api/runs/[id]` - Get a specific run
- `GET /api/runs/[id]/comments` - Get comments for a run
- `POST /api/runs/[id]/comments` - Post a comment

## Contributing

Feel free to add more bosses, items, or features! The game data is easily extensible in `data/gameData.ts`.

## Deployment

Deploy easily on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/he-is-coming-runlog)

## License

MIT License - Feel free to use this for your own gaming communities!

---

**We Are Losing** - Where every death tells a story, and the AI never lets you forget it. 💀🎮
