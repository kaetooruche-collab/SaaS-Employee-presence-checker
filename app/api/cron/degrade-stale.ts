import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireCronSecret } from "../../src/middleware/cronAuth";
import { degradeStaleStatuses } from "../../src/services/jobs";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireCronSecret(req, res)) return;
  await degradeStaleStatuses();
  res.status(200).json({ ok: true });
}
