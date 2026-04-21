# TravelAI — AI-Powered Smart Travel Platform

A full-stack travel planning platform with AI itinerary generation, hotel booking, interactive maps, and real-time collaborative trip planning.

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS|
| Backend  | Node.js, Express, TypeScript        |
| Database | MongoDB (Mongoose)                  |
| Cache    | Redis                               |
| AI       | OpenAI GPT-4o                       |
| Maps     | Google Maps JavaScript API          |
| Realtime | Socket.io                           |
| Auth     | JWT (jsonwebtoken + bcryptjs)       |
| Payments | Stripe (ready to integrate)         |
| Images   | Cloudinary                          |

---

## Project Structure

```
travel-platform/
├── client/                     # Next.js frontend
│   └── src/
│       ├── app/
│       │   ├── page.tsx        # Landing page
│       │   ├── layout.tsx      # Root layout + Navbar
│       │   ├── providers.tsx   # React Query + Auth context
│       │   ├── globals.css
│       │   ├── auth/
│       │   │   ├── login/page.tsx
│       │   │   └── register/page.tsx
│       │   ├── dashboard/page.tsx
│       │   ├── plan/page.tsx           ← Main AI planner
│       │   ├── trip/[id]/page.tsx
│       │   ├── hotels/page.tsx
│       │   └── admin/page.tsx
│       ├── components/
│       │   ├── layout/Navbar.tsx
│       │   ├── trip/
│       │   │   ├── ItineraryView.tsx
│       │   │   └── ChatBot.tsx
│       │   ├── hotel/HotelCard.tsx
│       │   └── map/TripMap.tsx
│       └── lib/api.ts          # Axios instance + interceptors
│
└── server/                     # Express backend
    └── src/
        ├── index.ts            # App entry point
        ├── config/
        │   ├── db.ts           # MongoDB connection
        │   ├── env.ts          # Environment variables
        │   └── socket.ts       # Socket.io setup
        ├── models/
        │   ├── User.ts
        │   ├── Trip.ts
        │   ├── Hotel.ts
        │   ├── Booking.ts
        │   ├── Review.ts
        │   └── Expense.ts
        ├── controllers/
        │   ├── auth.controller.ts
        │   ├── ai.controller.ts       ← GPT-4o integration
        │   ├── trip.controller.ts
        │   ├── hotel.controller.ts
        │   └── admin.controller.ts
        ├── routes/
        │   ├── auth.ts
        │   ├── ai.ts
        │   ├── trips.ts
        │   ├── hotels.ts
        │   ├── reviews.ts
        │   ├── expenses.ts
        │   └── admin.ts
        ├── middleware/
        │   ├── auth.ts         # JWT protect + adminOnly
        │   └── error.ts        # Global error handler
        └── utils/
            └── weather.ts      # OpenWeatherMap helper
```

---

## Setup

### 1. Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis (local or Upstash)

### 2. Clone and install

```bash
git clone <your-repo>
cd travel-platform

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 3. Environment variables

**Server** — copy `server/.env.example` to `server/.env` and fill in:
```
MONGO_URI=mongodb://localhost:27017/travel-platform
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_here
OPENAI_API_KEY=sk-...
GOOGLE_MAPS_KEY=AIza...
WEATHER_API_KEY=...
CLIENT_URL=http://localhost:3000
```

**Client** — copy `client/.env.local.example` to `client/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_MAPS_KEY=AIza...
```

### 4. Run locally

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Visit http://localhost:3000

### 5. Docker (optional)
```bash
docker-compose up
```

---

## API Endpoints

### Auth
| Method | Path               | Description        |
|--------|--------------------|--------------------|
| POST   | /api/auth/register | Register new user  |
| POST   | /api/auth/login    | Login              |
| GET    | /api/auth/me       | Get current user   |

### AI
| Method | Path                   | Description              |
|--------|------------------------|--------------------------|
| POST   | /api/ai/plan-trip      | Generate AI itinerary    |
| POST   | /api/ai/chat           | Streaming chatbot        |
| POST   | /api/ai/optimize-budget| Budget optimizer         |

### Trips
| Method | Path                        | Description             |
|--------|-----------------------------|-------------------------|
| GET    | /api/trips/my               | Get user's trips        |
| GET    | /api/trips/public           | Browse public trips     |
| GET    | /api/trips/:id              | Get single trip         |
| PUT    | /api/trips/:id              | Update trip             |
| DELETE | /api/trips/:id              | Delete trip             |
| POST   | /api/trips/:id/collaborators| Invite collaborator     |

### Hotels
| Method | Path          | Description              |
|--------|---------------|--------------------------|
| GET    | /api/hotels   | List + filter hotels     |
| GET    | /api/hotels/:id| Get hotel + reviews      |
| POST   | /api/hotels   | Create hotel (admin)     |
| PUT    | /api/hotels/:id| Update hotel (admin)     |

### Admin (admin role required)
| Method | Path          | Description              |
|--------|---------------|--------------------------|
| GET    | /api/admin/stats | KPIs + analytics      |
| GET    | /api/admin/users | User list             |

---

## Build Order (Recommended)

1. MongoDB + Express boilerplate + auth routes
2. Next.js frontend: login/register working
3. AI trip planner endpoint + plan page UI  ← **first live demo**
4. Hotel model + seeding script + hotel listing page
5. Google Maps integration
6. Booking flow + Stripe
7. Reviews + recommendations
8. Admin dashboard
9. Socket.io collaborative planning
10. Weather integration + expense tracker

---

## Key Design Decisions

- **JWT in localStorage** — simple for development; move to httpOnly cookies for production
- **Streaming chatbot** — uses SSE (Server-Sent Events) instead of WebSocket for one-way streaming
- **MongoDB for everything** — flexible schema suits AI-generated itinerary shapes
- **Redis** — used for rate limiting AI routes (protect OpenAI spend)
- **GPT-4o with `response_format: json_object`** — guarantees structured JSON back from the AI
# Travel-Platform
# Travel-Platform
# Travel-Planner
