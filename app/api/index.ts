import { app } from "../src/app";

// Vercel entrypoint. vercel.json rewrites every request here, since the
// app's own routes are at root paths ("/", "/roster", "/admin/...") rather
// than under /api. See docs/01-decision-log.md Decision D9.
export default app;
