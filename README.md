# TechHunter Backend

Backend service for AI Emergency Response System built with Next.js App Router, Prisma, and AWS RDS.

## Available Scripts

```bash
npm run dev              # Start development server on port 4000
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database with test data
npm run prisma:studio    # Open Prisma Studio (database GUI)
```

## Backend Structure

```text
app/
	api/
		health/
			route.ts        # Public API endpoint: GET /api/health
		sos/
			route.ts        # SOS emergency creation endpoint
		cases/
			route.ts        # Emergency cases listing endpoint

prisma/
	schema.prisma         # Database schema definition
	seed.ts               # Database seed data
	migrations/           # Database migrations

src/
	config/
		env.ts            # Environment configuration
	lib/
		errors.ts         # Shared error type
		http.ts           # API response helpers
		prisma.ts         # Prisma client instance
	modules/
		health/
			health.controller.ts
			health.service.ts
			index.ts
	types/
		api.ts            # Shared API response types
	index.ts            # Optional shared exports
```

## Database Setup

### Prisma Schema

The application uses PostgreSQL with the following models:
- **User**: Emergency service users with medical info
- **Hospital**: Hospital locations and bed availability
- **Driver**: Ambulance drivers with status tracking
- **PoliceUnit**: Police units for emergency response
- **EmergencyCase**: Emergency incidents with AI severity analysis

### AWS RDS Configuration

1. **Create AWS RDS PostgreSQL Instance**:
   - Go to AWS Console → RDS → Create database
   - Select PostgreSQL engine (recommended version 15+)
   - Choose instance class based on expected load
   - Enable encryption at rest
   - Set up VPC security groups

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and update with your AWS RDS credentials:

   ```bash
   DATABASE_URL="postgresql://username:password@your-db.cluster-xyz.us-east-1.rds.amazonaws.com:5432/emergency?sslmode=require"
   DIRECT_URL="postgresql://username:password@your-db.cluster-xyz.us-east-1.rds.amazonaws.com:5432/emergency?sslmode=require&pgbouncer=true"
   ```

   **Important**: Always use `sslmode=require` for production AWS RDS connections.

3. **Run Migrations**:
   ```bash
   npm run prisma:migrate
   ```

4. **Seed Database** (optional, for development):
   ```bash
   npm run prisma:seed
   ```

### Security Best Practices

- **SSL Required**: All database connections use SSL (`sslmode=require`)
- **Connection Pooling**: Use `DIRECT_URL` with PgBouncer for production
- **Least Privilege**: Create dedicated database user with minimal permissions
- **VPC Security Groups**: Restrict database access to application IP ranges
- **Encryption at Rest**: Enable AWS RDS encryption
- **Backup**: Enable automated backups and point-in-time recovery

## Health Check Endpoint

- Method: `GET`
- URL: `/api/health`
- Response includes: status, service name, environment, timestamp, and uptime.

## Environment Variables

Required:
- `DATABASE_URL`: PostgreSQL connection string with SSL
- `DIRECT_URL`: Direct connection URL for connection pooling (optional but recommended)

Optional:
- `APP_NAME` (defaults to `techhunter-backend`)
- `NODE_ENV` (managed by runtime)

See `.env.example` for full configuration options including AWS and security settings.

## API Endpoints

### POST /api/sos
Create a new emergency SOS request.

**Payload**:
```json
{
  "userId": "user-uuid",
  "locationLat": 40.7128,
  "locationLng": -74.0060,
  "imageUrls": ["https://example.com/accident.jpg"],
  "aiSeverity": "HIGH",
  "aiDescription": "Vehicle collision detected"
}
```

### GET /api/cases
Fetch emergency cases with optional status filter.

**Query Params**:
- `status`: Filter by status (PENDING, DISPATCHED, RESOLVED)

## Notes

- Keep route handlers in `app/api/**/route.ts`.
- Keep business logic inside `src/modules/*`.
- Put shared utility code in `src/lib` and config in `src/config`.
- Always use environment variables for sensitive data.
- Never commit `.env` files - use `.env.example` as template.
