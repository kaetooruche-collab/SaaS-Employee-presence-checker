import { app } from "./app";
import { startScheduledJobs } from "./services/jobs";

// Local-dev-only entrypoint. Not used in the Vercel deployment — see
// api/index.ts, which serves the same `app` without starting the
// in-process job scheduler (Vercel Cron calls api/cron/* instead).
const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Presence app listening on http://localhost:${port}`);
  startScheduledJobs();
});
