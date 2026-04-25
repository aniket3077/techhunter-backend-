# PulseRescue AI Backend

Next.js route-handler backend for the AI emergency response system.

## Core API routes

- `GET /api/health` service health
- `POST /api/sos` create a new emergency case
- `GET /api/cases` list emergency cases with optional filters
- `PATCH /api/cases/:caseId` update status, assignment, or AI details
- `GET /api/dashboard/summary` aggregate command-center metrics
- `GET /api/ambulances` list ambulance units and readiness
- `PATCH /api/ambulances/:driverId` update ambulance status or location

## Database

- Prisma schema targets PostgreSQL
- Prisma client is configured with `@prisma/adapter-pg`
- This setup is compatible with AWS RDS PostgreSQL

## Environment

```bash
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
```

`DATABASE_URL` is used by the runtime client.
`DIRECT_URL` can still be kept for migration tooling even though it is not consumed by `prisma.config.ts`.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

## Seed data

`prisma/seed.ts` includes demo users, hospitals, ambulance drivers, police units, and emergency cases for local testing.
