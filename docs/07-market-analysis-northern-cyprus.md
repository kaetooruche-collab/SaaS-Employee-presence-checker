# Northern Cyprus Market Evidence — First Pass

**Standing instruction from the Master Prompt, restated:** do not substitute Republic of Cyprus statistics
for TRNC statistics. Everything below is checked for which "Cyprus" it actually describes.

## What we have (VERIFIED, with scope caveats)

- The U.S. State Department's **2025 Investment Climate Statement for Cyprus** has a dedicated
  "Area Administered by Turkish Cypriots" subsection (distinct from the Republic-of-Cyprus-government
  sections elsewhere in the same document — good, it does not conflate the two):
  - MSME definition used in that area: **fewer than 250 employees**.
  - The area's "State Planning Office" estimated **total employment of over 159,000 people as of October
    2024**.
  - Source: https://www.state.gov/reports/2025-investment-climate-statements/cyprus (accessed 2026-10-16).
    This is a credible, dated, scope-correct primary-ish source (U.S. government report citing the TRNC's
    own statistical office), but it is a general investment-climate report, not a business-count census —
    it gives total employment, not number of businesses or their size distribution.

## What we do NOT have yet (UNKNOWN — explicitly not guessed)

- **Number of registered businesses in Northern Cyprus**, at all, let alone broken down by size band
  (0–9, 10–29, 30–150, 150–249, 250+ employees). This is the single number most needed to size SAM/SOM for
  the hypothesized 30–150-employee ICP, and it has not been found yet.
- Sector breakdown (how many of those businesses are multi-department — the hypothesis explicitly targets
  "multi-department" businesses, which is a UX/org-structure qualifier, not just a headcount one).
- Language distribution in the target business population (Turkish vs. English vs. Greek as working
  language — directly affects localization requirements for the product).
- Local purchasing behavior: whether TRNC SMBs typically buy SaaS by card self-serve, require local invoicing
  in TRY, require a local reseller/support presence, or expect free trials vs. paid pilots.
- Existing software penetration: how many target businesses already run Microsoft 365 (relevant to the Teams
  presence threat in `06-competitor-analysis.md`), Zoho, or a local/Turkish HRIS.
- A credible SaaS/software vendor directory or chamber-of-commerce membership list for Northern Cyprus that
  could anchor outbound research (not yet searched).
- Internet/device penetration specific to TRNC businesses (the search run in this pass returned general OECD
  SME digitalization material and a Cyprus-wide — likely Republic of Cyprus — internet-use-in-small-firms
  paper from UNECE, neither of which is confirmed to describe the TRNC-administered area; **do not cite
  these for TRNC-specific claims** without checking scope first).

## Immediate next research actions (ranked)

1. Find the TRNC State Planning Office's own business/establishment register or census, directly (not via a
   secondary citation), for an actual business count and size distribution.
2. Find TRNC Chamber of Commerce (Kıbrıs Türk Ticaret Odası / KTTO) membership statistics or sector
   breakdowns — likely to require searching in Turkish.
3. Identify 10–20 real candidate businesses in the 30–150-employee, multi-department band (hotels, private
   hospitals/clinics, universities' administrative staff, retail chains, construction firms, banks) by name,
   as a basis for actual problem-validation interviews rather than estimation.
4. Determine typical IT/software buying process at that size band in TRNC (is there usually an IT manager, an
   HR manager, or does the owner/GM decide?).

## Why this matters before any revenue model is drafted

The Master Prompt requires "evidence-based TAM/SAM/SOM where credible" and explicit labeling of assumptions
otherwise. Right now there is one real number (159,000 people employed TRNC-wide, Oct 2024) and no business
count. Any TAM/SAM/SOM produced before the above research actions would be an unlabeled guess dressed as
analysis — which the Master Prompt and the user's own standing instructions both explicitly forbid. No
revenue model should be finalized until at least action 1 and 3 above produce real numbers.
