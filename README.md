# Analytics Dashboard

A comprehensive, production-ready analytics dashboard for tracking user activity, conversion funnels, and UX insights with real-time monitoring capabilities.

## 🚀 Quick Start

This guide will walk you through the complete setup process step-by-step.

## Project Structure

```
ANALYTICS_DASHBOARD/
├── client/              # Next.js frontend (App Router)
│   ├── app/            # Next.js app directory with routes
│   ├── components/     # Reusable React components
│   └── lib/            # API utilities and helpers
│
└── server/             # Express backend API
    ├── src/
    │   ├── controllers/ # Business logic controllers
    │   ├── routes/      # API route definitions
    │   └── utils/       # Analytics logger and utilities
    └── prisma/          # Prisma ORM schema and migrations
```

## Database

**IMPORTANT**: This project uses the **SAME MySQL database** as EMS_DEMO_PROJECT_MAIN to ensure seamless integration and data consistency.

* Database: `cms_dev` (or as configured in your EMS project)
* Connection: Uses existing MySQL instance (Docker or local)
* **DO NOT** create a new database - the analytics tables are added to the existing database

### Database Migration

Run the migration SQL file to add analytics tables to your existing database:

```bash
# Run this file in your MySQL instance:
analytics_migration.sql
```

This migration creates the following tables:

* `user_sessions` - Session tracking with device and location data
* `user_activity` - Detailed event logging for all user actions
* `user_audit_log` - Comprehensive audit trail for security and compliance
* Enhances `users` table with `registration_method` and `last_password_changed_at` fields

## Setup

### Prerequisites

* Node.js 18+ and npm
* MySQL 8.0+ running (same instance as EMS)
* Existing EMS_DEMO_PROJECT_MAIN database

### 1. Database Migration

First, ensure the MySQL database is running and execute the migration:

```bash
# Connect to MySQL and run the migration:
mysql -u root -p cms_dev < analytics_migration.sql

# Verify tables were created:
mysql -u root -p cms_dev -e "SHOW TABLES LIKE '%user_%';"
```

### 2. Server Setup

```bash
cd ANALYTICS_DASHBOARD/server
npm install

# Copy .env.example to .env and configure
# IMPORTANT: Use the SAME database URL as your EMS project
cp .env.example .env

# Edit .env and set:
# DATABASE_URL="mysql://root:password@localhost:3306/cms_dev"
# CORS_ORIGIN="http://localhost:3001"
# PORT=4001

# Generate Prisma client from schema
npm run prisma:generate

# (Optional) Open Prisma Studio to view database
npm run prisma:studio

# Start development server
npm run dev
```

Server runs on: `http://localhost:4001`

### 3. Client Setup

```bash
cd ANALYTICS_DASHBOARD/client
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:4001" > .env.local

# Start Next.js development server
npm run dev
```

Client runs on: `http://localhost:3001`

### 4. Verify Installation

1. Open browser to `http://localhost:3001/analytics`
2. Check that dashboard loads without errors
3. Verify API connection in browser console
4. Check server logs for successful database connection

## API Endpoints

### Overview Dashboard

* `GET /api/analytics/overview` - Today's key metrics
  * Response: `{ visitors, totalUsers, totalRevenue, totalOrders }`
* `GET /api/analytics/revenue-trend?months=5` - Revenue trend analysis
  * Query params: `months` (default: 5)

### Conversion Funnel

* `GET /api/analytics/funnel?startDate=&endDate=` - Conversion funnel metrics
  * Query params: `startDate`, `endDate` (ISO format)
  * Returns: Registration, login, and conversion statistics

### User Analytics

* `GET /api/analytics/users?startDate=&endDate=` - Detailed user activity
  * Query params: `startDate`, `endDate` (ISO format)
  * Returns: Active users, page views, engagement metrics

### Session Analytics

* `GET /api/analytics/sessions` - Session data and tracking
* `GET /api/analytics/events` - Detailed event logs

## Analytics Logger Integration

Integrate the centralized analytics logger into your EMS application for comprehensive tracking:

```javascript
// Import the analytics logger
const { logEvent, createOrUpdateSession } = require('./ANALYTICS_DASHBOARD/server/src/utils/analyticsLogger');

// Example 1: Log a page view event
await logEvent({
  user_id: 123,
  session_id: sessionId,
  is_guest: false,
  event_type: 'page_view',
  page_url: '/dashboard',
  page_title: 'Dashboard',
  referrer: req.headers.referer,
  metadata: { 
    section: 'main',
    customData: 'value' 
  }
});

// Example 2: Log a button click
await logEvent({
  user_id: 123,
  session_id: sessionId,
  is_guest: false,
  event_type: 'button_click',
  page_url: '/products',
  element_id: 'add-to-cart-btn',
  metadata: { 
    product_id: 456,
    action: 'add_to_cart' 
  }
});

// Example 3: Create or update user session
const session = await createOrUpdateSession({
  session_token: 'unique-session-token',
  user_id: 123,
  is_guest: false,
  ip_address: req.ip,
  user_agent: req.headers['user-agent'],
  device_type: 'desktop', // desktop, mobile, tablet
  browser: 'Chrome',
  os: 'Windows 10'
});

// Example 4: Log user authentication
await logEvent({
  user_id: 123,
  session_id: sessionId,
  is_guest: false,
  event_type: 'auth_login',
  page_url: '/login',
  metadata: { 
    method: 'email',
    success: true 
  }
});
```

### Supported Event Types

* `page_view` - Page navigation tracking
* `button_click` - Button and link interactions
* `form_submit` - Form submissions
* `auth_login` / `auth_logout` - Authentication events
* `auth_register` - New user registrations
* `search` - Search queries
* `error` - Error occurrences
* Custom event types as needed

## Microsoft Clarity Integration

Microsoft Clarity is integrated in the client root layout for session replay and heatmap analysis.

**Setup Instructions:**

1. Sign up for free at <https://clarity.microsoft.com/>
2. Create a new project
3. Copy your Project ID from the Clarity dashboard
4. Replace `YOUR_CLARITY_PROJECT_ID` in `client/app/layout.tsx` with your actual Project ID
5. Deploy and wait 1-2 hours for data to appear in Clarity dashboard

**Features Provided by Clarity:**

* Session replay recordings
* Heatmaps (click, scroll, area)
* Rage click detection
* Dead click identification
* Excessive scrolling alerts

**Note**: Clarity data is stored and processed by Microsoft Clarity's servers, not in your database. This provides unlimited storage for session replays and heatmaps without impacting your database performance.

## Dashboard Routes

Navigate between different analytics views:

* `/analytics` - Overview dashboard with key metrics
* `/analytics/funnel` - Conversion funnel analysis and drop-off points
* `/analytics/users` - User behavior and engagement analytics
* `/analytics/ux` - UX insights with link to Microsoft Clarity

## Tech Stack

### Client (Frontend)

* **Framework**: Next.js 16 (App Router architecture)
* **Language**: TypeScript for type safety
* **UI Library**: React 19
* **Charts**: Recharts for data visualization
* **Styling**: Tailwind CSS for utility-first styling
* **Components**: Radix UI for accessible component primitives
* **HTTP Client**: Native Fetch API

### Server (Backend)

* **Runtime**: Node.js 18+
* **Framework**: Express.js for REST API
* **ORM**: Prisma for type-safe database access
* **Database**: MySQL 8.0+
* **Authentication**: JWT support (to be integrated)

### DevOps

* **Database Management**: Prisma Migrate
* **Environment**: Docker support 
* **Version Control**: Git

## Important Notes

1. **Shared Database Architecture**: Analytics uses the same MySQL database as EMS to ensure data integrity and eliminate synchronization issues.

2. **Non-Destructive Changes**: All database changes are additive only. No existing EMS tables are modified or dropped during migration.

3. **Isolated Codebase**: Analytics is a completely separate project from EMS, promoting modularity and maintainability.

4. **External UX Data**: Microsoft Clarity stores session replay data externally, keeping your database lean and performant.

5. **Performance**: Analytics queries are optimized with proper indexes. Monitor query performance in production.

6. **Data Privacy**: Ensure compliance with GDPR, CCPA, and other privacy regulations. Configure Clarity's privacy settings appropriately.

7. **Scalability**: For high-traffic applications, consider implementing:
   * Event queue (Redis, RabbitMQ)
   * Read replicas for analytics queries
   * Data archival strategy

## Development

### Server Development

```bash
cd server

# Start development server with hot reload
npm run dev

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Create new migration
npm run prisma:migrate dev --name migration_name

# Reset database (caution: deletes data)
npm run prisma:migrate reset

# Run tests
npm test
```

### Client Development

```bash
cd client

# Start Next.js dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type check
npm run type-check
```

## Production Deployment

### Server Deployment

```bash
cd server

# Build the application
npm run build

# Set environment variables
export DATABASE_URL="your_production_database_url"
export CORS_ORIGIN="https://your-domain.com"
export NODE_ENV="production"

# Start production server
npm start
```

### Client Deployment

```bash
cd client

# Build optimized production bundle
npm run build

# Set environment variable
export NEXT_PUBLIC_API_URL="https://api.your-domain.com"

# Start production server
npm start
```

### Recommended Deployment Platforms

* **Client**: Vercel, Netlify, AWS Amplify
* **Server**: AWS EC2, DigitalOcean, Heroku, Railway
* **Database**: AWS RDS, DigitalOcean Managed Databases, PlanetScale

## Troubleshooting

### Database Connection Issues

**Problem**: Cannot connect to MySQL database

**Solutions**:
* Verify MySQL is running: `mysql -u root -p`
* Check DATABASE_URL in `server/.env` matches EMS configuration
* Ensure database name is correct (usually `cms_dev`)
* Verify MySQL user has proper permissions
* Check firewall settings if using remote database

### Prisma Issues

**Problem**: Prisma client out of sync or schema errors

**Solutions**:
* Regenerate Prisma client: `npm run prisma:generate`
* Update database schema: `npm run prisma:db push`
* Check Prisma schema matches database structure
* Clear Prisma cache: Delete `node_modules/.prisma`

### API Connection Errors

**Problem**: Client cannot reach server API

**Solutions**:
* Verify server is running on port 4001
* Check CORS_ORIGIN in `server/.env` matches client URL
* Ensure NEXT_PUBLIC_API_URL in `client/.env.local` is correct
* Check browser console for detailed error messages
* Verify no firewall blocking the ports
* Test API directly: `curl http://localhost:4001/api/analytics/overview`

### Port Conflicts

**Problem**: Ports 3001 or 4001 already in use

**Solutions**:
* Change server port in `server/.env`: `PORT=4002`
* Change client port: `npm run dev -- -p 3002`
* Kill existing processes: `lsof -ti:4001 | xargs kill -9`

### Missing Dependencies

**Problem**: Module not found errors

**Solutions**:
* Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
* Clear npm cache: `npm cache clean --force`
* Ensure all dependencies in `package.json` are installed

### Migration Errors

**Problem**: SQL migration fails

**Solutions**:
* Check MySQL user permissions
* Verify syntax in `analytics_migration.sql`
* Run migration statements one by one to identify issue
* Check for table name conflicts
* Ensure MySQL version compatibility (8.0+)

## Performance Optimization

### Database Optimization

```sql
-- Add indexes for common queries (included in migration)
CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_event_type ON user_activity(event_type);
CREATE INDEX idx_user_activity_created_at ON user_activity(created_at);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
```

### Query Optimization Tips

* Use date range filters to limit result sets
* Implement pagination for large datasets
* Cache frequently accessed data
* Use aggregation queries for dashboard metrics
* Consider materialized views for complex analytics

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **API Authentication**: Implement JWT tokens for API endpoints (coming soon)
3. **SQL Injection**: Prisma provides protection, but validate user inputs
4. **CORS**: Configure CORS_ORIGIN restrictively in production
5. **Rate Limiting**: Implement rate limiting for API endpoints
6. **Data Privacy**: Anonymize sensitive user data, comply with privacy laws

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## Support

For issues, questions, or contributions:
* Open an issue on GitHub
* Contact the development team
* Check the documentation

## License

[Add your license information here]

## Changelog

### Version 1.1
* Initial release with core analytics features
* Overview dashboard with key metrics
* Conversion funnel analysis
* User behavior tracking
* Microsoft Clarity integration
* Real-time session monitoring

### Upcoming Features
* Advanced segmentation and filtering
* Custom event tracking builder
* A/B testing framework
* Export functionality (CSV, PDF)
* Email reports and alerts
* Multi-language support
* Dark mode support
