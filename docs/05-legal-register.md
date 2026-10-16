# Legal & Privacy Register — First Pass

**Status: preliminary. Nothing in this document is legal advice. Every item marked "requires qualified
local counsel" must be verified by a lawyer licensed in the relevant jurisdiction (TRNC and/or Turkey)
before any claim to customers or any compliance design decision is finalized.**

## Finding 1 — GDPR does not apply to a Northern-Cyprus-only business merely by location (VERIFIED, high confidence)

The EU accession treaty that brought Cyprus into the EU in 2004 includes **Protocol 10 on Cyprus**, Article
1(1): "The application of the *acquis* shall be suspended in those areas of the Republic of Cyprus in which
the Government of the Republic of Cyprus does not exercise effective control." The *acquis* includes GDPR.
The European Commission's own page on the **Green Line Regulation** confirms the north is "outside the EU's
customs and fiscal territory, and outside the EU's area of freedom, justice and security."

Sources:
- European Commission, "Green Line Regulation" — https://commission.europa.eu/about/departments-and-executive-agencies/regional-and-urban-policy/green-line-regulation_en (accessed 2026-10-16)
- Protocol 10 to the 2003 Act of Accession — https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:12003T/PRO/10 (accessed 2026-10-16, via secondary citation)
- Robert Schuman Foundation, "Cyprus: 20 years of membership of the European Union" — confirms the suspension framing (accessed 2026-10-16)

**This directly corrects the Master Prompt's own instruction to "assess jurisdiction-specific applicability
of GDPR" as if applicability were a given.** It is not a given. It is, on current evidence, inapplicable by
territory.

## Finding 2 — GDPR can still reach a TRNC business extraterritorially, but only under narrow conditions (VERIFIED mechanism, HYPOTHESIS as applied to this product)

GDPR Article 3(2) applies to controllers "not established in the Union" when they offer goods/services to,
or monitor, data subjects who are physically in the EU. Mere website accessibility, a non-geo-restricted
email address, or an EU-reachable phone number are explicitly *insufficient* per Recital 23 and the EDPB's
Guidelines 3/2018 on territorial scope (adopted 12 Nov 2019, pages 17–18 list nine factors: e.g., EU-targeted
ads, EU currency/language use, naming EU countries, international delivery, non-domestic TLD).

**Applied to this product:** a workplace presence tool sold to a TRNC employer, tracking that employer's own
TRNC-based employees, is very unlikely to trigger Article 3(2) — there is no obvious EU data subject being
targeted. This changes IF: (a) a customer employs EU-resident remote staff whose presence data would be
processed, (b) the vendor markets into the Republic of Cyprus or EU in EUR/English-for-EU/EU ad targeting, or
(c) a later roadmap decision adds EU customers. **Flag for the product-definition stage: if "integration
scope" or "customer segment" expands to include any EU-resident employees or EU-domiciled buyer companies,
re-open this finding before launch.**

Sources: EDPB Guidelines 3/2018 v2.1 (cited via elevates.it secondary summary, accessed 2026-10-16 — **the
primary EDPB PDF itself has not yet been read directly; do this before relying on this finding for a legal
representation to customers**).

## Finding 3 — A TRNC-specific data protection law exists and is the one that actually applies (HYPOTHESIS, single non-legal-practitioner source — needs counsel verification)

Per one source (a design-agency blog, not a law firm — **weak primary-source quality, flagged**): **Law
89/2007** ("Kişisel Verilerin Korunması Yasası" / Personal Data Protection Law), published in TRNC Resmî
Gazete (Official Gazette) No. 210 on 26 November 2007, is the controlling local data protection law. Claimed
features:
- A notification duty to a data protection board before processing begins.
- Article 10: every organisation processing personal data must designate at least one person responsible
  for data protection — **no company-size threshold**, i.e. would apply to a 30-person employer same as a
  3,000-person one, if accurate.
- Article 35: fines denominated in "Yeni Türk Lirası" (YTL), a currency retired in 2010 and apparently never
  uprated — described as making the maximum fine worth under €100 at today's exchange rates.
- No publicly recorded enforcement action found in 19 years.
- A data protection authority appears to exist at kvkk.gov.ct.tr (not yet independently verified in this
  pass).

A second, independent, more authoritative-looking source (mahkemeler.net, a TRNC legal/judicial-adjacent
site) separately references **"Personal Data Protection Law No. 89/2007"** by name, which corroborates the
law's existence and number but not the detail above.

**This is the single most important unresolved legal question for this product and must be moved from
"single blog source" to "verified via TRNC Official Gazette text + local counsel" before the legal
assessment deliverable (D) can be finalized.** A law with a real notification/designated-person duty but a
real-world-unenforced fine still creates reputational, contractual, and B2B-sales-objection risk even if
regulatory risk is low — customers' own counsel may ask the vendor about it.

Sources:
- https://elevates.it/en/blogs/gdpr-north-cyprus-business/ (accessed 2026-10-16) — **non-legal source,
  publication date irregularity noted below**
- https://www.mahkemeler.net/en/kurumsal (accessed 2026-10-16) — references "Personal Data Protection Law
  No. 89/2007" and "Cybercrime Law" together
- TRNC Ministry of Foreign Affairs data protection notice — https://mfa.gov.ct.tr/pages/data-protection
  (accessed 2026-10-16) — confirms only that *some* TRNC data protection legislation exists ("the legislation
  in force in the TRNC on the protection of personal data") without citing the law number; this is a
  government source but it is general and non-specific.

**Source-quality caveat:** the elevates.it article's own metadata shows a published/modified date in
September 2026 and references a "null result checked 6 September 2026," i.e., it is a very recent piece by a
commercial web agency selling GDPR-compliance-audit services — it has a sales incentive to make the risk
analysis sound simultaneously scary (GDPR Art. 27) and reassuring (local law is toothless), which is a bias
to weigh. Treat its legal conclusions as a lead to verify, not as settled fact.

## Finding 4 — Turkey's KVKK does not automatically apply to TRNC entities, but there is an institutional link (HYPOTHESIS)

Turkey's Law No. 6698 (KVKK) applies to controllers/processors handling personal data of individuals "residing
in Turkey" or collected from Turkey (sources: dlapiperdataprotection.com, mydata-trust.com, accessed
2026-10-16); it is a separate legal and institutional regime from the TRNC's own law, despite surface
similarity in acronym and intent. However, a secondary source (gentemizer.com, a Turkish law firm insight
piece, April–May 2024) states Turkey's KVKK authority signed a **cooperation agreement** with "the Turkish
Republic of Northern Cyprus' Personal Data Protection [authority]" in that period. The practical legal effect
of that cooperation agreement on a TRNC business (e.g., mutual recognition, data-sharing standards, joint
enforcement) is **unknown and requires counsel** — do not assume it means KVKK applies, but also do not
assume it is irrelevant, e.g. for cross-border data transfer questions if a future architecture decision puts
infrastructure or support staff in Turkey.

Source: https://www.gentemizer.com/insight/two-minute-recap-of-recent-developments-in-turkish-personal-data-protection-law-april-may-2024/ (accessed 2026-10-16)

## Finding 5 — Employment law, VAT, contracts, IP, NIS2/Cyber Resilience Act/Data Act/DSA/EU AI Act (UNKNOWN — not yet researched)

None of these have been investigated yet in this pass. Given Finding 1 (EU acquis suspended), **NIS2, the
Cyber Resilience Act, the Data Act, the DSA, and the EU AI Act most likely do not apply by territory either**,
by the same Protocol 10 logic — but this is an inference from Finding 1, not independently verified, and
each of these instruments has its own scope rules (e.g., the EU AI Act has some extraterritorial reach for AI
systems whose output is used in the EU, similar in spirit to GDPR Art. 3(2)). **Do not state to a customer or
investor that none of these apply without verifying each one's own extraterritoriality clause.** Local TRNC
employment law (termination, data-in-HR-context rules, works-council-equivalent consultation requirements if
any) and VAT/tax treatment of a SaaS sold locally are entirely unresearched. Logged as open questions in
`04-open-questions.md`.

## Required before Deliverable D (legal/privacy/security assessment) can be finalized

1. Retrieve and read the TRNC Resmî Gazete No. 210 (26 Nov 2007) text directly, or an authoritative
   secondary legal source (law firm, not a web agency), to confirm Law 89/2007's actual provisions.
2. Engage TRNC-qualified counsel to confirm: (a) the law's current force and amendments since 2007, (b) real
   penalty exposure beyond the obsolete-currency fine (e.g., can contract/tort liability or administrative
   orders bite even if the statutory fine is trivial), (c) the Turkey-KVKK cooperation agreement's actual
   legal effect, (d) TRNC employment-law constraints on monitoring/recording employee location or status.
3. Independently confirm whether EU AI Act / NIS2 / Cyber Resilience Act / Data Act / DSA extraterritorial
   clauses could reach this product under any plausible roadmap (e.g., if the vendor itself is EU-based, or
   if customers include EU-resident remote employees).
4. Resolve VAT/invoicing treatment for a SaaS sold to TRNC businesses (TRNC tax authority rules, not RoC/EU
   VAT rules, per Finding 1's logic, but unverified).
