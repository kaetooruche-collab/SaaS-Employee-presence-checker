# Competitive Intelligence — First Pass

## Direct/near-direct competitors (dedicated workplace presence/attendance tools)

### Envoy Workplace
- Core product is visitor management; "Workplace" tier adds desk booking and **presence integrations**
  (automatic on-site detection/check-in), gated to an "Enterprise" tier.
- Pricing: base visitor-management pricing publicly listed around **$2/visitor** or **$362/location/month**
  (billed annually) per capterra-cited competitor pages; presence integrations are an add-on beyond base,
  behind a sales-quoted enterprise tier — exact price for presence features not published.
- Pricing is **location-based**, not seat-based — a structural mismatch for a single-site 30–150-employee
  company, which is this product's hypothesized ICP; Robin's own competitor page makes this contrast
  explicitly ("pricing tied to locations rather than actual workplace usage").
- Sources: https://envoy.com/pricing ; https://envoy.help/en/articles/7263142-envoy-workplace ;
  https://robinpowered.com/blog/envoy-overview (all accessed 2026-10-16)
- **Implication:** Envoy is built for multi-location enterprises with visitor-management as the anchor use
  case; presence is a bolt-on. It is over-built and likely overpriced for a single-site 30–150-employee SMB,
  but it is evidence that "presence as a feature of a bigger workplace platform" is the dominant
  commercial pattern, not "presence as a standalone product" — a threat to this hypothesis's positioning.

### Robin, OfficeRnD, and similar workplace-ops platforms
- Positioned as unified workplace operations platforms (desk/room booking + presence + analytics), direct
  competitors to Envoy, same enterprise/multi-location lean. Not yet pricing-verified in this pass — logged
  as an open question.

### Deputy / When I Work (adjacent: scheduling + attendance, not "presence" per se)
- Seat-based pricing: When I Work starts at **$2.50/user/month**, Deputy at **$5.00/user/month** (per
  softwareglimpse.com and capterra.com comparison pages, accessed 2026-10-16).
- These are shift-scheduling/time-clock tools for hourly/shift workforces, not multi-department white-collar
  presence dashboards — different buyer motion (compliance/labor-cost control, not "who's at their desk
  right now") but they prove the price ceiling SMBs will tolerate for adjacent per-seat HR tooling is low
  (~$2.50–$10/user/month), which bounds what this product could plausibly charge.

## Bundled/free indirect competitors — the biggest threat to this hypothesis

### Microsoft Teams presence (free with any Microsoft 365 seat the target customer likely already owns)
- Teams has had automatic calendar-integrated presence states for years, including "Working Elsewhere," tied
  to calendar busy/free status, and exposed via Microsoft Graph's `availabilityView` (free=0, tentative=1,
  busy=2, out-of-office=3, **workingElsewhere=4**).
- This is free, already deployed at most 30–150-employee office businesses that use Microsoft 365, requires
  zero new vendor relationship, and already answers "is this person reachable/at their desk right now" for
  the knowledge-worker segment.
- Sources: ServiceNow docs on presence dot colors (accessed 2026-10-16); Microsoft Graph documentation
  references via Scribd mirror (accessed 2026-10-16, low-quality source, to be replaced with
  learn.microsoft.com direct citation in next pass); reclaim.ai blog on Teams status behavior (accessed
  2026-10-16).
- **This is the single most important competitive threat and must shape the exact product definition.** Any
  version of this product that competes head-on with "is this person at their computer" for desk-based
  knowledge workers is competing with a free, already-installed feature. The product's actual differentiated
  value, if any, has to be: (a) **physical presence** (in the building vs. logged into a laptop — Teams
  presence is about digital activity, not physical location) and/or (b) **cross-tool aggregation** for
  companies whose different departments use different tools (some on Teams, some not, blue-collar/on-site
  staff with no Microsoft seat at all), and/or (c) a manager-facing roll-up view that Teams does not provide
  out of the box. This needs explicit validation, not assumption.

### Zoho People / Zoho Workplace — explicitly required by the Master Prompt to be investigated as a "already solves it" risk
- Zoho People already ships: time clock check-in/check-out, a leave calendar, and a **"who's in your
  department"**-style department-tree view showing current attendance status, per multiple independent
  reviewer/implementation sources (connecteam.com's Zoho People review; woggleconsulting.com; infomazeelite.com
  implementation case notes — all accessed 2026-10-16, mix of reviewer/consultant sources, no single one is
  Zoho's own primary documentation, which should be pulled directly in the next pass).
- One of those sources (infomazeelite.com, a Zoho implementation consultancy) frames **"no real-time
  attendance visibility — managers don't know who's in until staff physically arrive"** as a problem Zoho
  People implementations are specifically brought in to fix — i.e., even companies that already own Zoho
  People sometimes fail to get live presence visibility out of it in practice (configuration/adoption gap,
  not a capability gap).
- **Implication, directly answering the Master Prompt's required check:** Zoho People/Workplace does NOT
  obviously fail to solve this problem at the feature-checklist level for a company already on Zoho. The
  more plausible unmet need, if one exists, is in (a) companies not on Zoho at all, (b) the
  configuration/UX gap the implementation consultants are describing (the feature exists but isn't
  surfaced/adopted), or (c) multi-system aggregation Zoho can't do for a company that also runs, say, a
  separate access-control/badge system or a different tool in another department. This must be tested with
  real prospects, not assumed.

## What has not yet been researched (logged, not guessed)

- HR/attendance platforms common specifically **in Northern Cyprus or Turkey** (local/regional vendors,
  possibly Turkish-market HRIS tools, which may be more relevant competitors than US/EU-centric Envoy/Robin
  given language, currency, and support-expectation fit).
- Open-source self-hosted options.
- Badge/access-control systems (HID, physical turnstile/badge vendors) as an indirect data source competitors
  could integrate before a new SaaS does.
- Exact current Robin/OfficeRnD pricing and feature parity vs. Envoy.
- Direct, primary-source documentation (not reviewer blogs) for Zoho People's presence feature and
  Microsoft Graph's presence API, to replace the secondary sources used in this first pass.
