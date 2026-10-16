import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireCronSecret } from "../../src/middleware/cronAuth";
import { resetAtDayBoundary } from "../../src/services/jobs";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireCronSecret(req, res)) return;
  // 5-minute window to match this cron's own schedule — see vercel.json
  // and the comment on isWithinBoundaryWindow in src/services/jobs.ts.
  await resetAtDayBoundary(5);
  res.status(200).json({ ok: true });
}
