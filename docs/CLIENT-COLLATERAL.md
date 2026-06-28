# Client Collateral

Reference: 2026-06-28 EDT

This document reviews the repository from the perspective of helping Jason win a first consulting client.

The first implementation can absolutely lean on the ArcadeGhosts `Work With Me` direction, but shared generator logic should stay brand-configurable rather than hardcoding ArcadeGhosts-specific assumptions.

## Intended Asset Set

### Proposal Cover

- Purpose:
  create a polished first page for proposals, statements of work, and lightweight pitch decks.
- Audience:
  prospective clients who are already evaluating whether Jason feels credible, clear, and distinctive.
- Generator status:
  no dedicated generator yet.
- Production maturity:
  planned client-acquisition priority.
- Dependencies:
  `Work With Me` scene direction, brand metadata, service copy, contact details, and likely the existing hero-composition + document-shell patterns.

### Capability Sheet

- Purpose:
  summarize services, strengths, engagement types, and contact information in one page.
- Audience:
  warm leads, referrals, conference contacts, and anyone who needs a fast overview before a call.
- Generator status:
  no dedicated generator yet.
- Production maturity:
  planned client-acquisition priority.
- Dependencies:
  service positioning copy, proof points, contact metadata, and a print-friendly document or poster-style layout.

### Discovery Call PDF

- Purpose:
  give prospects a concise, branded leave-behind before or after a discovery call.
- Audience:
  people considering an intro call who need structure, reassurance, and a clear next step.
- Generator status:
  no dedicated generator yet.
- Production maturity:
  planned client-acquisition priority.
- Dependencies:
  `Work With Me` contact framing, call agenda copy, FAQ/process copy, and likely document-shell or presentation-cover building blocks.

### Case Study Template

- Purpose:
  provide a reusable format for showing outcomes, process, and credibility once real client work exists.
- Audience:
  prospects who need evidence that Jason can solve business problems, not just build a brand system.
- Generator status:
  no dedicated generator yet.
- Production maturity:
  planned, but should be informed by actual project outcomes after the first client lands.
- Dependencies:
  narrative structure, metrics slots, testimonial slots, before/after visuals, and reusable page-cover or document-shell patterns.

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
  brand metadata, contact info, `Work With Me` scene styling, email-client-safe HTML constraints, and review in actual mail clients.

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
- `email signature`
  directly supports outreach and follow-up, but still needs real-client email-client proofing.
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
  visually useful, but still secondary until the core client-collateral set exists.
- `OG`, `LinkedIn`, `GitHub social`, `website hero`, `icons`
  important for a coherent presence and website integration, but they are more credibility/support surfaces than direct sales collateral.
- `preview` and theme sweeps
  useful internal review tooling, not client-acquisition deliverables.

Bottom line:

- The repo already demonstrates a strong brand system.
- The biggest gap for first-client acquisition is not more merch or more surface variety.
- The biggest gap is reusable client-facing documents that turn the `Work With Me` direction into proposal, capability, and discovery assets.

## After First Paying Client

Real client work should reshape generator priorities.

- Promote the case study template once there is actual client outcome material to document.
- Use real proposal, discovery, and invoice feedback to refine layout requirements before adding adjacent document generators.
- Capture repeated client-delivery patterns first:
  proposal cover variations, capability-sheet sections, testimonial modules, timeline blocks, and simple SOW or summary-page structures.
- Only add new generator families if a real client workflow exposes a repeated need that cannot be handled by existing document, cover, or hero-composition systems.
- Let second-brand or client-brand onboarding follow evidence from actual engagements instead of guessing too early.
