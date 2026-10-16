import type { VercelRequest, VercelResponse } from "@vercel/node";

// Deliberately kept OUTSIDE the /api directory: in the classic Vercel
// convention (which this project uses, not the file-based-router
// convention some frameworks add), every file directly under /api becomes
// its own deployed route — there is no Next.js-style "_prefixed files are
// ignored" rule here. A shared helper living under api/ would otherwise be
// its own (unintended) public endpoint.
//
// Vercel's documented pattern: set CRON_SECRET as an env var and Vercel
// Cron automatically sends it as a Bearer token on every scheduled
// invocation. Returns true and does nothing if the request is authorized;
// otherwise writes a 401 and returns false so the caller can bail out.
export function requireCronSecret(req: VercelRequest, res: VercelResponse): boolean {
  const secret = process.env.CRON_SECRET;
  const header = req.headers.authorization;
  if (!secret || header !== `Bearer ${secret}`) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return false;
  }
  return true;
}
