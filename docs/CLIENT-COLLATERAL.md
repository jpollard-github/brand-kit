# Client Collateral

Reference: 2026-06-28 EDT

This document reviews the repository from the perspective of helping Jason win a first consulting client.

The first implementation can absolutely lean on the ArcadeGhosts `Work With Me` direction, but shared generator logic should stay brand-configurable rather than hardcoding ArcadeGhosts-specific assumptions.

Recent-work note:

- The newest generator work already added proposal cover, capability sheet, discovery call, and case study template outputs.
- That is useful progress, but the stricter first-client priority order should now be:
  capability sheet as the primary warm-lead leave-behind;
  email signature and Work-With-Me business card as first-touch support assets;
  discovery call and proposal cover as later-stage support.

## Intended Asset Set

### Proposal Cover

- Purpose:
  create a polished first page for proposals, statements of work, and lightweight pitch decks.
- Audience:
  prospective clients who are already evaluating whether Jason feels credible, clear, and distinctive.
- Generator status:
  existing generator: `npm run brand:proposal-cover` or `npm run brand:client-collateral`.
- Production maturity:
  production candidate.
- Dependencies:
  `Work With Me` scene direction, brand metadata, service copy, contact details, and likely the existing hero-composition + document-shell patterns.

### Capability Sheet

- Purpose:
  summarize the most common client pain patterns, the current consulting service packages, and the easiest warm-lead next step in one page.
- Audience:
  warm leads, referrals, and anyone who needs a fast overview after interest exists and before or around a call.
- Generator status:
  existing generator: `npm run brand:capability-sheet` or `npm run brand:client-collateral`.
- Production maturity:
  production candidate.
- Dependencies:
  service positioning copy, proof points, contact metadata, and a print-friendly document or poster-style layout.
- Verification status:
  now includes a lightweight manifest and `npm run brand:verify:capability-sheet` preflight check.
- Layout direction:
  preserve the current dark-hero, light-body, card/grid, one-page format as the preferred production-candidate direction for client-facing collateral.
- Current content standard:
  rendered output should stay client-facing.
  Keep internal notes like usage guidance, CTA metadata, or review instructions in docs and config comments, not in the PDF itself.
  Lead with 3-4 concrete business pain patterns rather than a broad everything-I-can-do skills catalog.

### Discovery Call PDF

- Purpose:
  give warm leads a concise, branded qualification aid before or around a discovery call.
- Audience:
  people with real interest who need structure, reassurance, and a clear post-interest next step.
- Generator status:
  existing generator: `npm run brand:discovery-call` or `npm run brand:client-collateral`.
- Production maturity:
  production candidate.
- Dependencies:
  `Work With Me` contact framing, call agenda copy, FAQ/process copy, and likely document-shell or presentation-cover building blocks.

### Case Study Template

- Purpose:
  provide a reusable format for showing outcomes, process, and credibility once real client work exists.
- Audience:
  prospects who need evidence that Jason can solve business problems, not just build a brand system.
- Generator status:
  existing generator: `npm run brand:case-study-template` or `npm run brand:client-collateral`.
- Production maturity:
  proof of concept until real client work exists.
- Dependencies:
  narrative structure, metrics slots, testimonial slots, before/after visuals, and reusable page-cover or document-shell patterns.

### Mini Flyer

- Purpose:
  provide a simple leave-behind or small-format local outreach asset when a lightweight printed handout is genuinely useful.
- Audience:
  local businesses, meetup contacts, conference conversations, or referral contexts where a quick physical summary helps.
- Generator status:
  existing generator: `npm run brand:mini-flyer`.
- Production maturity:
  prototype until a real local handoff use case is confirmed.
- Dependencies:
  concise offer framing, contact details, visual restraint, and a believable local handoff use case.
- Current decision:
  keep this out of the first-client stack for now unless a real local leave-behind need appears.

### Email Signature

- Purpose:
  make every outbound email reinforce credibility, services, and the easiest next step.
- Audience:
  prospects, referrals, conference contacts, and anyone receiving direct outreach.
- Generator status:
  existing generator: `npm run brand:email-signature`.
- Production maturity:
  production candidate.
- Dependencies:
  brand metadata, contact info, client-collateral positioning data, `Work With Me` scene styling, email-client-safe HTML constraints, and review in actual mail clients.
- Verification status:
  now includes a lightweight manifest and `npm run brand:verify:email` preflight check.
- Layout direction:
  preserve the current Work-With-Me framing, but prefer the slimmer production layout:
  compact logo treatment, concise role line, minimal contact rows, and one focused `Work With Me` CTA that survives real email clients.

### Conference Badge

- Purpose:
  support in-person networking with a clear service-facing identity and recognizable brand presence.
- Audience:
  conference attendees, meetup contacts, and potential clients who meet Jason in person.
- Generator status:
  existing generator: `npm run brand:conference-badge`.
- Production maturity:
  production candidate.
- Dependencies:
  `Work With Me` scene styling, name/title/contact framing, print-size legibility, and event/vendor proofing.

### Letterhead

- Purpose:
  give proposals, summaries, and client-facing PDFs a lightweight branded document shell.
- Audience:
  prospects and clients receiving formal or semi-formal written material.
- Generator status:
  existing generator within `npm run brand:documents`.
- Production maturity:
  production candidate.
- Dependencies:
  document generator shell, brand metadata, print-safe layout rules, and downstream proposal/discovery content.

### Invoice

- Purpose:
  present billing in a way that feels intentional and trustworthy once paid work begins.
- Audience:
  active clients at the billing stage.
- Generator status:
  existing generator within `npm run brand:documents`.
- Production maturity:
  production candidate for visual shell only.
- Dependencies:
  document generator shell, billing fields, legal/business details, and the actual accounting workflow outside this repo.

## Maturity Review

Useful now for acquiring consulting work:

- `business cards`
  strongest current workflow; especially the `Work With Me` card set because it already points to a contact-oriented next step.
  Treat the card as a first-touch support asset, not a tiny capability sheet.
- `capability sheet`
  the primary warm-lead and referral asset because it answers what Jason helps with, which service packages fit, which concrete problems he solves, and how to start.
- `email signature`
  the best first operational support asset because it directly supports every outbound message and follow-up, but it still needs real-client email-client proofing.
  Keep default messaging stable across themes, and keep `Work With Me` as the primary first-touch CTA.
- `proposal cover`
  useful once a prospect is warm enough for a scoped recommendation or proposal.
- `discovery call PDF`
  useful after real interest exists because it makes qualification feel calm and concrete without replacing the capability sheet.
  Keep it secondary to the capability sheet in the current funnel.
- `mini flyer`
  potentially useful for local leave-behind or event use, but should still follow the email signature and capability sheet in practical attention and does not currently earn first-client focus.
- `conference badge`
  directly supports in-person lead generation, but still needs vendor/event workflow validation.
- `letterhead`
  useful as a shell for proposals or discovery follow-up PDFs, but not enough on its own.
- `invoice`
  useful after acquisition for trust and professionalism, but it does not help much with top-of-funnel acquisition by itself.

Useful mostly for demonstrating the brand system, not for closing a first client:

- `stickers`, `sticker sheet`, `mugs`, `shirts`, `totes`
  expressive merch, but low leverage for near-term consulting acquisition.
- `wallpapers`, `stream thumbnail`
  atmospheric brand surfaces with limited sales utility.
- `newsletter header`, `project cover`, `presentation cover`, `mini flyer`
  visually useful, but only `mini flyer` belongs in the first-client collateral stack; the others are still secondary until the core outreach assets are stronger.
- `OG`, `LinkedIn`, `GitHub social`, `website hero`, `icons`
  important for a coherent presence and website integration, but they are more credibility/support surfaces than direct sales collateral.
- `preview` and theme sweeps
  useful internal review tooling, not client-acquisition deliverables.

Bottom line:

- The repo already demonstrates a strong brand system.
- The biggest gap for first-client acquisition is not more merch or more surface variety.
- The biggest gap is reusable client-facing documents that turn the `Work With Me` direction into proposal, capability, and discovery assets.

## One-Page Collateral Family

The current capability-sheet layout should become the preferred base style for future one-page client collateral such as:

- capability sheet
- one-service overview
- case study
- proposal overview
- discovery summary
- audit report
- pricing guide
- project recommendation

Shared family resemblance should stay consistent:

- same hero structure
- same typography
- same spacing rhythm
- same footer pattern
- same CTA placement
- same card radius
- same color language

Content changes. The system stays consistent.

This style works especially well for:

- warm leads
- referrals
- pre-call attachments
- first-client outreach support

## Shared Service Vocabulary

Across the first-client collateral family, keep the service language compatible even when the length changes by asset.

- Short:
  `Software Consultant | Internal Tools & AI Workflows`
- Medium:
  `Workflow assessments, internal tools, modernization, and practical AI-assisted delivery.`
- Expanded:
  `I help small and mid-sized businesses clean up workflows, modernize existing software, and build small internal tools with practical AI where it helps.`

The business problem should lead.
Complex-codebase and repository support should appear as a secondary capability rather than the main headline.

## Customer Journey

Operational path:

`Business Card or Email Signature -> Work With Me -> Capability Sheet -> Discovery Call -> Proposal -> Invoice`

### Awareness

- `business cards`
  strongest proven physical workflow, but each card still needs checklist proofing before it should be called `Production Ready`.
- `email signature`
  production candidate and the highest immediate first-touch support asset.
- `LinkedIn / website links`
  supporting paths that should usually route people toward `Work With Me`.
- `mini flyer`
  prototype until a real local use case is confirmed.

### Interest

- `Work With Me`
  canonical public entry point.
- `capability sheet`
  production candidate and the primary warm-lead leave-behind.
  Keep it `Production Candidate` until it has been visually proofed, reviewed in a real outreach context, checked for print/PDF readability, confirmed to export cleanly as one page or with intentional page breaks, stripped of internal/meta wording, and confirmed against the production checklist.

### Evaluation

- `proposal cover`
  production candidate.
- `discovery call guide`
  production candidate.
  Treat it as a secondary post-interest qualification asset, not a cold-outreach leave-behind.
- `case study template`
  proof of concept until real client work exists.

### Payment

- `invoice`
  production candidate.
- `discovery session link`
  only after conversation, qualification, and agreement.

### Project Start

- `proposal / statement-of-work style material`
  currently supported by proposal-cover, letterhead, and discovery-oriented collateral rather than a full SOW system.
- `invoice / payment handoff`
  production candidate shell, still dependent on the real billing workflow outside this repo.

## After First Paying Client

Real client work should reshape generator priorities.

- Promote the case study template once there is actual client outcome material to document.
- Use real proposal, discovery, and invoice feedback to refine layout requirements before adding adjacent document generators.
- Capture repeated client-delivery patterns first:
  proposal cover variations, capability-sheet sections, testimonial modules, timeline blocks, and simple SOW or summary-page structures.
- Only add new generator families if a real client workflow exposes a repeated need that cannot be handled by existing document, cover, or hero-composition systems.
- Let second-brand or client-brand onboarding follow evidence from actual engagements instead of guessing too early.

## Reusable Collateral Contract

For the shared business-link and CTA contract, see [docs/BUSINESS-LINKS-CONTRACT.md](docs/BUSINESS-LINKS-CONTRACT.md).

This doc focuses on where assets fit in the customer journey and how mature they are operationally.

## CTA Hierarchy

For the shared CTA hierarchy and business-link ownership model, see [docs/BUSINESS-LINKS-CONTRACT.md](docs/BUSINESS-LINKS-CONTRACT.md).
