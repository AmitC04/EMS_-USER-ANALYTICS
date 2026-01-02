# Analytics Dashboard

A standalone analytics dashboard for tracking user activity, conversion funnels, and UX insights.

## 🚀 Quick Start

This guide will walk you through the setup step-by-step.

## Project Structure

```
ANALYTICS_DASHBOARD/
├── client/              # Next.js frontend (App Router)
│   ├── app/            # Next.js app directory
│   ├── components/     # React components
│   └── lib/            # API utilities
│
└── server/             # Express backend
    ├── src/
    │   ├── controllers/ # API controllers
    │   ├── routes/      # API routes
    │   └── utils/       # Analytics logger
    └── prisma/          # Prisma schema
```

## Database

**IMPORTANT**: This project uses the **SAME MySQL database** as EMS_DEMO_PROJECT_MAIN.

- Database: `cms_dev` (or as configured in EMS)
- Connection: Uses existing MySQL instance (Docker or local)
- **DO NOT** create a new database

### Database Migration

Run the migration SQL file to add analytics tables:

```sql
-- Run this file:
analytics_migration.sql
```

This will create:
- `user_sessions` - User session tracking
- `user_activity` - Event logging
- `user_audit_log` - Audit trail
- Modifies `users` table (adds `registration_method`, `last_password_changed_at`)

## Setup

### 1. Database Migration

First, ensure the MySQL database is running and run the migration:

```bash
# Connect to MySQL and run:
mysql -u root -p cms_dev < analytics_migration.sql
```

### 2. Server Setup

```bash
cd ANALYTICS_DASHBOARD/server
npm install

# Copy .env.example to .env and update DATABASE_URL
# Use the SAME database URL as EMS project
cp .env.example .env

# Generate Prisma client
npm run prisma:generate

# Start server
npm run dev
```

Server runs on: `http://localhost:4001`

### 3. Client Setup

```bash
cd ANALYTICS_DASHBOARD/client
npm install

# Create .env.local (optional, defaults to localhost:4001)
echo "NEXT_PUBLIC_API_URL=http://localhost:4001" > .env.local

# Start development server
npm run dev
```

Client runs on: `http://localhost:3001`

## API Endpoints

### Overview
- `GET /api/analytics/overview` - Today's metrics (visitors, users, revenue, orders)
- `GET /api/analytics/revenue-trend?months=5` - Revenue trend over time

### Funnel
- `GET /api/analytics/funnel?startDate=&endDate=` - Conversion funnel data

### User Analytics
- `GET /api/analytics/users?startDate=&endDate=` - User activity metrics

## Analytics Logger

Use the centralized logger in your EMS application:

```javascript
const { logEvent, createOrUpdateSession } = require('./ANALYTICS_DASHBOARD/server/src/utils/analyticsLogger');

// Log an event
await logEvent({
  user_id: 123,
  session_id: sessionId,
  is_guest: false,
  event_type: 'page_view',
  page_url: '/dashboard',
  page_title: 'Dashboard',
  metadata: { custom: 'data' }
});

// Create/update session
const session = await createOrUpdateSession({
  session_token: 'unique-token',
  user_id: 123,
  is_guest: false,
  ip_address: req.ip,
  user_agent: req.headers['user-agent']
});
```

## Microsoft Clarity Integration

Microsoft Clarity is integrated in the client root layout (`client/app/layout.tsx`).

**To enable:**
1. Sign up at https://clarity.microsoft.com/
2. Get your Project ID
3. Replace `YOUR_CLARITY_PROJECT_ID` in `client/app/layout.tsx`

**Note**: Clarity data is NOT stored in the database. It's handled externally by Microsoft Clarity.

## Routes

- `/analytics` - Overview dashboard
- `/analytics/funnel` - Conversion funnel
- `/analytics/users` - User analytics
- `/analytics/ux` - UX insights (links to Clarity)

## Tech Stack

### Client
- Next.js 16 (App Router)
- TypeScript
- React 19
- Recharts
- Tailwind CSS
- Radix UI components

### Server
- Node.js
- Express.js
- Prisma ORM
- MySQL 8

## Important Notes

1. **Same Database**: Analytics uses the same MySQL database as EMS. No duplicate databases.
2. **Additive Only**: Database changes are additive only. Existing EMS tables are not modified.
3. **Isolated Project**: Analytics is completely separate from EMS codebase.
4. **MS Clarity**: UX replay data is stored externally by Microsoft Clarity, not in our database.

## Development

### Server
```bash
cd server
npm run dev          # Start server
npm run prisma:studio # Open Prisma Studio
```

### Client
```bash
cd client
npm run dev          # Start Next.js dev server
npm run build        # Build for production
```

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Check DATABASE_URL in server/.env matches EMS configuration
- Verify database name is correct (usually `cms_dev`)

### Prisma Issues
- Run `npm run prisma:generate` after schema changes
- Ensure Prisma schema points to correct database

### API Errors
- Check server is running on port 4001
- Verify CORS_ORIGIN in server/.env matches client URL
- Check browser console for API errors

