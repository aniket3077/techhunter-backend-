export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <main className="mx-auto flex max-w-5xl flex-col gap-10">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-10 shadow-2xl shadow-slate-950/30">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            PulseRescue API
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white">
            Backend services for AI-assisted emergency intake, triage, dispatch, and fleet coordination.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            This service exposes route handlers for SOS creation, emergency case monitoring,
            dashboard summaries, and ambulance unit management.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
            <h2 className="text-lg font-semibold text-white">Key endpoints</h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              <li><code className="rounded bg-slate-800 px-2 py-1 text-cyan-200">GET /api/health</code></li>
              <li><code className="rounded bg-slate-800 px-2 py-1 text-cyan-200">POST /api/sos</code></li>
              <li><code className="rounded bg-slate-800 px-2 py-1 text-cyan-200">GET /api/cases</code></li>
              <li><code className="rounded bg-slate-800 px-2 py-1 text-cyan-200">PATCH /api/cases/:caseId</code></li>
              <li><code className="rounded bg-slate-800 px-2 py-1 text-cyan-200">GET /api/dashboard/summary</code></li>
              <li><code className="rounded bg-slate-800 px-2 py-1 text-cyan-200">GET /api/ambulances</code></li>
              <li><code className="rounded bg-slate-800 px-2 py-1 text-cyan-200">PATCH /api/ambulances/:driverId</code></li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
            <h2 className="text-lg font-semibold text-white">Deployment target</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Prisma is configured for a PostgreSQL datasource, which makes the service ready
              for AWS RDS PostgreSQL or any other compatible managed database.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Frontend apps can connect through a same-origin rewrite or by using the public API
              base URL exposed in their environment configuration.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
