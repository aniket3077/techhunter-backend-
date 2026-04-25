# TechHunter Backend

Backend service scaffold built with Next.js App Router route handlers.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Backend Structure

```text
app/
	api/
		health/
			route.ts        # Public API endpoint: GET /api/health

src/
	config/
		env.ts            # Environment configuration
	lib/
		errors.ts         # Shared error type
		http.ts           # API response helpers
	modules/
		health/
			health.controller.ts
			health.service.ts
			index.ts
	types/
		api.ts            # Shared API response types
	index.ts            # Optional shared exports
```

## Health Check Endpoint

- Method: `GET`
- URL: `/api/health`
- Response includes: status, service name, environment, timestamp, and uptime.

## Environment Variables

- `APP_NAME` (optional, defaults to `techhunter-backend`)
- `NODE_ENV` (managed by runtime)

## Notes

- Keep route handlers in `app/api/**/route.ts`.
- Keep business logic inside `src/modules/*`.
- Put shared utility code in `src/lib` and config in `src/config`.
