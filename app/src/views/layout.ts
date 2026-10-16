// Deliberately no templating engine, no bundler, no client-side framework —
// doc 11 excludes a native app and calls for "one responsive web page,
// link-based access" assuming low digital fluency and patchy connectivity.
// Plain server-rendered HTML loads fast and needs nothing installed.

export function page(title: string, body: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
  body { font-family: -apple-system, system-ui, sans-serif; margin: 0; padding: 16px; background: #f7f7f8; color: #1a1a1a; }
  .card { background: white; border-radius: 10px; padding: 16px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  h1 { font-size: 1.3rem; }
  .status-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee; }
  .status-row:last-child { border-bottom: none; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 0.85rem; font-weight: 600; }
  .badge-present { background: #d5f5e3; color: #1e7e42; }
  .badge-away { background: #fff3cd; color: #8a6d00; }
  .badge-remote { background: #d6e9ff; color: #0b5ed7; }
  .badge-off_site { background: #e2d6ff; color: #5a2ca0; }
  .badge-on_leave { background: #e8e8e8; color: #555; }
  .badge-unconfirmed { background: #f8d7da; color: #a12a34; }
  .stale { color: #999; font-size: 0.8rem; }
  button, input[type=submit] { font-size: 1rem; padding: 10px 16px; border-radius: 8px; border: none; background: #1a1a1a; color: white; cursor: pointer; }
  input[type=text], input[type=tel] { font-size: 1rem; padding: 10px; border-radius: 8px; border: 1px solid #ccc; width: 100%; box-sizing: border-box; }
  .status-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .status-grid button { flex: 1 1 auto; background: #eee; color: #1a1a1a; }
  nav { margin-bottom: 16px; font-size: 0.9rem; }
  nav a { color: #555; text-decoration: none; margin-right: 12px; }
</style>
</head>
<body>
${body}
</body>
</html>`;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatAgo(date: Date): string {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export const STATUS_LABELS: Record<string, string> = {
  present: "Present",
  away: "Away",
  remote: "Remote",
  off_site: "Off-site",
  on_leave: "On leave",
  unconfirmed: "Unconfirmed",
};
