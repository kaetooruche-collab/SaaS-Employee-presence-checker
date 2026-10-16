# Practical Problems You're Likely to Face Launching This

Written for a founder who has already decided to build and sell this, relationship-led, into TRNC
workplaces. Not a market study. This is "what will actually bite you," ordered by how early it bites.

## 1. Privacy / data — the thing you said matters most

**You are building an employee-monitoring tool, whether you call it that or not.** Recording whether
someone is present, away, remote, off-site, or on leave is workplace surveillance by definition, even at the
lightest-touch end of it. That's true regardless of which specific law applies. Treat the following as real
launch requirements, not paperwork for later:

- **Tell employees it exists and what it records, in writing, before it goes live.** Not because a
  regulator will likely come after you (see below — probably not) but because the first time an employee
  finds out their "away/present" status was logged without being told, you get a trust blow-up at the one
  company whose word-of-mouth you're relying on to sell the next ten. This is a product-survival issue
  before it's a legal one.
- **Local law, best current read:** TRNC has its own data protection law (Law 89/2007), not GDPR — GDPR
  doesn't apply here by territory (`05-legal-register.md`). That law, on the one source found so far,
  requires (a) notifying a data protection authority before processing, and (b) naming at least one person
  responsible for data protection, with no exemption for small companies. The penalty for ignoring it looks
  trivial (a fine in a currency that stopped existing in 2010) and there's no record of anyone ever being
  enforced against. **That source is a web agency's blog, not a lawyer** — before you tell a customer "we're
  compliant," get one TRNC lawyer to confirm or correct this in writing. It's a cheap, one-time check, not
  an ongoing compliance program, and it's the one piece of this whole engagement I'd still push you to do
  before your first paid customer, specifically so you have a straight answer when a customer's office
  manager asks "is this legal."
- **Minimize what you actually store.** The product only needs a current status and maybe a short history
  for "freshness." It does not need GPS coordinates, browsing activity, or anything beyond what a manager
  needs to see. The less personal data you hold, the smaller every other problem on this list gets —
  smaller breach impact, smaller employee-trust risk, smaller "what law applies to this" surface area.
- **Decide who can see what, before you build, not after.** A manager seeing their own department's status
  is very different from the whole company seeing everyone's. Get this wrong and you'll either have a
  gossip/surveillance backlash ("why can Dave in accounting see I left early") or managers complaining they
  can't see enough. Pick a default (department-scoped visibility, admin sees all) and let admins override
  it — don't ship "everyone sees everyone."
- **Have a real answer for "can an employer fire someone using this data."** Even without a specific TRNC
  statute on it, if status data ever gets used as evidence in a termination dispute, you (the vendor) will
  get dragged into it reputationally even if you're not a legal party. Put a line in your terms saying the
  data is for coordination, not disciplinary record-keeping, and don't build features that make it easy to
  export a personal attendance history for that purpose. This is a product-design decision, not just a legal
  one.
- **One live edge case to watch, not a current problem:** if any customer ever has an EU-resident remote
  employee, or you ever sell into the EU/Republic of Cyprus, GDPR's extraterritorial rule can reach you even
  though it doesn't apply by location today. Just ask new customers at onboarding "does anyone on this list
  work from an EU country" and you'll know if this ever becomes relevant. Don't build for it now.

## 2. Trust and adoption — this kills presence tools more often than anything legal does

- **Stale data is worse than no data.** If a status says "present" and the person left an hour ago, the
  first time someone acts on that (goes looking for them, tells a client they're in) and gets burned, people
  stop trusting the tool — and then stop using it, which makes the data even staler. You need an honest
  "last updated X minutes ago" signal from day one, not a polished-looking status that's secretly guessing.
- **People will game it.** Someone will mark themselves "present" from home because it's easier than
  explaining. The more consequences get attached to status (visible to execs, tied to attendance review),
  the more incentive there is to lie to the system. Low-stakes, low-friction tools get honest data; anything
  that feels like it's being used to police people gets gamed.
- **Manual self-reporting has a ceiling.** If the only way a status updates is someone remembering to tap a
  button, adoption decays within weeks — this is the single most common failure mode for this category of
  tool. Whatever automatic signal you can get (calendar, check-in, badge, anything) matters more long-term
  than any UI polish.
- **The person who has to update their status gets none of the benefit — the manager does.** That's an
  asymmetry worth designing around: the easier and more invisible you make updating for the employee, the
  less this friction shows up as resentment ("why do I have to do extra work so my boss can watch me").

## 3. Commercial durability — you're probably right that price and pitch matter more than features here, but two things still bite later

- **"Cheap enough not to matter" is a renewal risk, not just a sales tactic.** A price low enough that
  nobody blinks at signing is also low enough that nobody notices if they stop using it — churn at renewal
  tends to show up exactly where adoption quietly died (see section 2) and nobody questioned the invoice
  until it came up for renewal. Watch actual usage per customer, not just signed deals — that's the real
  renewal-risk signal, not the price itself.
- **One-founder, relationship-led sales doesn't scale past a certain point, and that's fine — just know the
  ceiling going in.** Word-of-mouth can get you the first handful of customers. It won't get you to the point
  where you can take a day off. Decide now whether the plan is to stay small and profitable at that scale, or
  to professionalize sales/support later — don't let it be an accident.

## 4. Operational and technical decisions that are cheap now and expensive to fix later

These aren't reasons to slow down — they're things to decide *while* building, because retrofitting them
after you have paying customers' data in the system is much more painful than deciding now:

- **Multi-tenant data isolation from day one.** Even with one customer today, build it so Company A can
  never see Company B's data by construction, not by convention. Retrofitting isolation after a second
  customer signs, under time pressure, is how you get a breach.
- **Login/onboarding has to assume low digital fluency, not high.** You said yourself this is a low-
  digitization environment — don't assume employees will install an app, remember a password, or read a
  setup email carefully. The simplest viable version (e.g. a link that just works, SMS/WhatsApp-based
  check-in, no account creation) will get more real usage than a "proper" app with onboarding friction.
- **Assume patchy internet/power at some customer sites, and design for it failing gracefully** (a stale-but-
  honest status beats a broken screen) rather than assuming always-on connectivity.
- **Have a real backup and "what if I'm unavailable for a week" plan before the first paying customer**, not
  before the tenth. You're a solo founder; a data loss or outage with zero customers costs you nothing, the
  same incident with five paying customers costs you the relationships you're building this whole business
  on.
- **Write a one-page terms-of-service / data-handling agreement before your first paid customer**, even
  informally. It doesn't need a lawyer at this size to start, but it needs to exist, because it's also where
  you put the "this isn't a disciplinary record" line from section 1 and the "here's what we store and why"
  line that keeps the trust problem in section 2 from becoming a legal problem too.

## What I'd actually do first, in order

1. Decide the minimum data you record and who sees what (section 1) — this shapes everything else and costs
   nothing to decide now.
2. Get the one-time local-counsel check on Law 89/2007 and the notification/designated-person requirement —
   cheap, fast, and it's the one thing that could otherwise sit as an unanswered question with every future
   customer.
3. Build the simplest possible version that updates status with the least friction for the employee, and
   pitch it to your own workplace first, exactly as you said. Watch whether people actually keep it updated
   after week two — that's the real signal, more than anything a market study could have told you.
4. Write the one-page terms/data-handling note before that first pitch, not after.

Everything else in this document set (full market analysis, exhaustive competitor pricing, formal risk
register) stays here as background if you ever want to revisit it, but none of it should block you from
doing 1–4 above.
