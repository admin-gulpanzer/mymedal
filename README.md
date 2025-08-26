# MyMedal - Digital Race Medal Collection

A modern React application for collecting and showcasing your race medals with authentication and database integration.

## Features

- User authentication with Stack Auth
- Digital medal collection and management
- Race database with participant stats
- Responsive design with Tailwind CSS
- Full-stack monorepo structure
- Ready for Vercel deployment

## Architecture

This is a monorepo structure with separate frontend and backend applications:

```
mymedal/
├── frontend/          # React + TypeScript frontend
├── backend/           # Node.js + Express backend
├── package.json       # Root monorepo configuration
├── vercel.json        # Vercel deployment config
└── README.md          # This file
```

### Frontend (frontend/ - React + TypeScript)
- Built with Create React App and TypeScript
- Stack Auth for user authentication
- Tailwind CSS for styling
- API integration for backend communication

### Backend (backend/ - Node.js + Express + TypeScript)
- RESTful API with Express
- PostgreSQL database via Neon
- Stack Auth JWT verification
- TypeScript for type safety

### Database (Neon PostgreSQL)
- **races**: Race information and details
- **race_stats**: Participant data with bib numbers and results
- **user_medals**: User's claimed medals with verification
- **neon_auth.users**: User profiles managed by Stack Auth

## Getting Started

### Prerequisites
- Node.js 16+ installed
- Neon database account
- Stack Auth account

### Environment Setup

1. **Frontend (frontend/.env)**:
```env
REACT_APP_STACK_PROJECT_ID=your-stack-project-id
REACT_APP_STACK_PUBLISHABLE_CLIENT_KEY=your-stack-publishable-key
REACT_APP_API_URL=http://localhost:3001
```

2. **Backend (backend/.env)**:
```env
DATABASE_URL=your-neon-connection-string
NEXT_PUBLIC_STACK_PROJECT_ID=your-stack-project-id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your-stack-publishable-key
STACK_SECRET_SERVER_KEY=your-stack-secret-key
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Installation & Development

1. **Install dependencies**:
```bash
# Install all dependencies (root, frontend, and backend)
npm run install:all

# Or install individually:
# Root dependencies
npm install

# Frontend dependencies
cd frontend && npm install

# Backend dependencies
cd backend && npm install
```

2. **Start development servers**:
```bash
# Both servers concurrently (recommended)
npm run dev

# Or start individually:
# Frontend (port 3000) - in terminal 1
npm run dev:frontend

# Backend (port 3001) - in terminal 2
npm run dev:backend
```

3. **Build for production**:
```bash
# Build both frontend and backend
npm run build

# Or build individually:
npm run build:frontend
npm run build:backend
```

## Database Schema

### Races Table
```sql
CREATE TABLE races (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  location VARCHAR(255),
  distance VARCHAR(50),
  race_type VARCHAR(50),
  medal_image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Race Stats Table
```sql
CREATE TABLE race_stats (
  id SERIAL PRIMARY KEY,
  race_id INTEGER REFERENCES races(id),
  participant_name VARCHAR(255) NOT NULL,
  bib_number VARCHAR(50) NOT NULL,
  finish_time INTERVAL,
  overall_place INTEGER,
  age_group_place INTEGER,
  age_group VARCHAR(20),
  gender VARCHAR(10),
  city VARCHAR(100),
  state VARCHAR(50),
  country VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User Medals Table
```sql
CREATE TABLE user_medals (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  race_id INTEGER REFERENCES races(id),
  race_stat_id INTEGER REFERENCES race_stats(id),
  medal_image_url TEXT,
  claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  is_verified BOOLEAN DEFAULT FALSE
);
```

## API Endpoints

### Races
- `GET /api/races` - Get all races
- `GET /api/races/:id` - Get specific race
- `GET /api/races/:id/stats` - Get race statistics

### Medals (Protected)
- `GET /api/medals` - Get user's medals
- `POST /api/medals/claim` - Claim a medal
- `PATCH /api/medals/:id` - Update medal
- `DELETE /api/medals/:id` - Delete medal claim

### User (Protected)
- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update user profile

## Deployment

### Vercel Deployment

1. **Connect to Vercel**:
```bash
vercel --prod
```

2. **Environment Variables**: Set the following in Vercel dashboard:
- `DATABASE_URL`
- `STACK_SECRET_SERVER_KEY`
- `NEXT_PUBLIC_STACK_PROJECT_ID`
- `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`

3. **Domain Configuration**: Update the CORS settings in production for your domain.

## Sample Data

The database is seeded with:
- 3 sample races (Boston Marathon 2024, NYC Half Marathon 2024, Chicago 10K 2024)
- Sample race statistics for user "John Doe"
- 3 sample medal claims for demonstration

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Stack Auth
- **Backend**: Node.js, Express, TypeScript, PostgreSQL
- **Database**: Neon PostgreSQL
- **Authentication**: Stack Auth
- **Deployment**: Vercel
- **Development**: Create React App, Nodemon, Concurrently

## Monorepo Structure

```
mymedal/
├── frontend/                 # React frontend application
│   ├── src/                 # React components and logic
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   └── .env                 # Frontend environment variables
├── backend/                 # Node.js backend API
│   ├── src/                 # API routes and logic
│   ├── package.json         # Backend dependencies
│   └── .env                 # Backend environment variables
├── package.json             # Root monorepo configuration
├── vercel.json              # Vercel deployment settings
└── README.md                # This documentation
```

## Development Notes

- The app uses a clean monorepo structure with separate frontend and backend directories
- Stack Auth handles all user management and authentication
- The backend uses JWT tokens from Stack Auth for API protection
- Medal claiming requires matching bib numbers with race statistics
- All database operations use parameterized queries for security
- Use `npm run dev` to start both frontend and backend concurrently
- Both applications can be deployed together on Vercel as a single project