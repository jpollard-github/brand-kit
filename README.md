# Brand Kit

This repository is a reusable client-collateral system for ArcadeGhosts and related brand surfaces, implemented through source-driven generators.

## Setup

Requirements:

- Node.js
- npm

Install:

```bash
npm install
```

## Start Here

If you are new to the repo, use this order:

1. [docs/repo-map.md](docs/repo-map.md)
2. [TODO.md](TODO.md)
3. [docs/CLIENT-COLLATERAL.md](docs/CLIENT-COLLATERAL.md)
4. [docs/BUSINESS-LINKS-CONTRACT.md](docs/BUSINESS-LINKS-CONTRACT.md)
5. [docs/PRODUCTION-CHECKLIST.md](docs/PRODUCTION-CHECKLIST.md)
6. [docs/networking-assets.md](docs/networking-assets.md)
7. [docs/APPLE-WALLET-PASS-SETUP.md](docs/APPLE-WALLET-PASS-SETUP.md)
8. [docs/ARCADEGHOSTS-WORK-WITH-ME-HANDOFF.md](docs/ARCADEGHOSTS-WORK-WITH-ME-HANDOFF.md)
9. [brands/arcadeghosts/README.md](brands/arcadeghosts/README.md)
10. [brands/arcadeghosts/what-makes-arcadeghosts.md](brands/arcadeghosts/what-makes-arcadeghosts.md)
11. [brands/arcadeghosts/theme-variants.md](brands/arcadeghosts/theme-variants.md)
12. [design-system/brand-config.ts](design-system/brand-config.ts)
13. [generators/social/hero-composition.ts](generators/social/hero-composition.ts)

## Current approach

- Keep source copy, assets, and generator logic in version control.
- Generate print and export artifacts locally from the included generators.
- Treat generated outputs as local build artifacts rather than source files.
- Preserve the current ArcadeGhosts business-card workflow as the first working brand implementation.

## Source Of Truth

Use the repo with three mental buckets:

- Canonical source:
  `design-system/`, `brands/`, and generator source files under `generators/*/*.ts`
- Generated outputs:
  files under `generators/outputs/` and generator proof/export artifacts such as `exports/`, manifests, preview HTML, and rendered PNG/PDF files
- Archive / history:
  files under `archive/`, which preserve old working material without being the current source of truth

If a file can be regenerated from brand config, copy, assets, and generator code, it should usually be treated as generated rather than canonical.
That includes business-card export PNGs, PDFs, and `export-manifest.json` files.

## Architecture Status

Brand Kit should now be considered `Stable v1` and `Operational v1`.

Future work should prioritize production readiness, real-world usage, generator polish, verification, and customer feedback rather than architectural expansion or speculative new collateral.

## Brand-agnostic direction

The repo is now structured to support a shared design-system layer that can be reused across multiple brands and output types.

- Brand configuration lives under the design-system folder.
- The current ArcadeGhosts brand is preserved as the default brand.
- Brand-specific reference material lives under the brands folder, with a dedicated ArcadeGhosts folder for the current implementation.
- Future brands can be introduced by adding brand config and copy data without replacing the current workflow.

## What Brand Kit Can Generate

From a configured brand, Brand Kit can currently generate:

- Business cards:
  `npm run brand:business-cards`, `npm run brand:business-cards:guides`, `npm run brand:business-cards:pdf`, `npm run brand:business-cards:order-ready`
- Client-facing collateral:
  `npm run brand:client-collateral`, `npm run brand:proposal-cover`, `npm run brand:capability-sheet`, `npm run brand:discovery-call`, `npm run brand:case-study-template`
- Email signature:
  `npm run brand:email-signature`
- Documents and stationery:
  `npm run brand:documents`
  Current document shells include letterhead and invoice.
- Web and social graphics:
  `npm run brand:og`, `npm run brand:linkedin`, `npm run brand:github-social`, `npm run brand:website-hero`, `npm run brand:website-handoff`
- Brand icons:
  `npm run brand:icons`
- Covers and headers:
  `npm run brand:newsletter`, `npm run brand:project-cover`, `npm run brand:presentation-cover`
- Event and outreach surfaces:
  `npm run brand:conference-badge`, `npm run brand:mini-flyer`, `npm run asset:conference-card`, `npm run asset:lock-screen`, `npm run asset:wallet-pass`, `npm run asset:wallet-pass:sign`, `npm run asset:networking`
- Wallpapers and video surfaces:
  `npm run brand:wallpapers`, `npm run brand:stream-thumbnail`
- Merch and physical brand surfaces:
  `npm run brand:stickers`, `npm run brand:sticker-sheet`, `npm run brand:mugs`, `npm run brand:shirts`, `npm run brand:totes`
- Review and preview utilities:
  `npm run brand:preview`, `npm run brand:preview:themes`, `npm run brand:packet:client-collateral`, `npm run review:packet`

Generator implementations live under `generators/`.
Improve existing collateral before adding new collateral families.

## Generator Families

This is the current generator-family map:

- `business-cards`
  Work With Me and broader ArcadeGhosts business-card fronts/backs, guide exports, proof PDFs, and order-ready outputs.
- `client-collateral`
  Proposal cover, capability sheet, discovery call guide, and case-study template.
- `email`
  HTML email signature, PNG proof, and manifest/preflight support.
- `documents`
  Letterhead and invoice shells.
- `social`
  OG image, LinkedIn banner, and GitHub social graphics.
- `website`
  Website hero art and website handoff assets.
- `icons`
  Site/app icon exports.
- `newsletter`
  Newsletter header.
- `projects`
  Project cover art.
- `presentations`
  Presentation cover art.
- `badges`
  Conference badge.
- `posters`
  Mini flyer.
- `networking`
  Conference card, lock screen, Apple Wallet pass scaffolding/signing flow, QR verification, and networking review packet support.
- `wallpapers`
  Desktop/mobile wallpaper exports.
- `video`
  Stream thumbnail.
- `stickers`
  Individual stickers and sticker sheet.
- `mugs`
  Mug mockups/exports.
- `shirts`
  Shirt mockups/exports.
- `totes`
  Tote-bag mockups/exports.
- `preview`
  Multi-output preview sheet and theme sweeps.

See the generator-family docs under:

- [generators/business-cards/README.md](generators/business-cards/README.md)
- [generators/client-collateral/README.md](generators/client-collateral/README.md)
- [generators/email/README.md](generators/email/README.md)
- [generators/documents/README.md](generators/documents/README.md)
- [generators/social/README.md](generators/social/README.md)
- [generators/website/README.md](generators/website/README.md)
- `generators/*/README.md` for the rest of the family-specific notes

## Scene Families

The repo now has two primary scene families for ArcadeGhosts:

- `ArcadeGhosts Hero`
  This is the expressive brand/world scene and should drive:
  OG image, LinkedIn banner, GitHub social, website hero, newsletter header, project cover, presentation cover, wallpapers, mini flyer, and stream thumbnail.
- `Work With Me Hero`
  This is the clearer service/contact scene and should drive:
  email signature, conference badge, letterhead, invoice, and any future client-facing service collateral.

The goal is to adapt one composition family across aspect ratios instead of redesigning the same idea from scratch for every surface.

## Collateral Maturity

Use these levels as workflow expectations, not as a judgment on visual quality:

- `Prototype`
  early or architecture-validating surfaces that still need clearer operational use, such as mini flyer and preview-oriented review surfaces.
- `Proof of Concept`
  useful exploration value, but not yet trustworthy as real operational collateral. Current examples include case study template until real client work exists, stickers, sticker sheet, mugs, shirts, totes, stream thumbnail, and website handoff staging.
- `Production Candidate`
  useful assets that are close to operationally real, but still need broader workflow proof. Current examples include OG image, LinkedIn banner, GitHub social, website hero, icons, newsletter header, project cover, presentation cover, conference badge, wallpapers, documents, email signature, proposal cover, capability sheet, and discovery call guide.
- `Production Ready`
  repeatable outputs with clear handoff and stronger verification confidence. Business cards are the strongest current example.
- `Deprecated`
  intentionally historical or no-longer-active material, including `archive/` and older conversation/context folders under `vschats/`.

## Current Status By Family

This is the practical status snapshot after the latest verification and smoke-generation pass.

- `Production Ready`
  `business-cards`
- `Production Candidate`
  `client-collateral` proposal cover, capability sheet, and discovery call guide
  `networking`
  `email`
  `documents`
  `social`
  `website` hero
  `icons`
  `newsletter`
  `projects`
  `presentations`
  `badges`
  `wallpapers`
- `Proof of Concept`
  `client-collateral` case-study template
  `website` handoff staging
  `stickers`
  `mugs`
  `shirts`
  `totes`
  `video`
- `Prototype`
  `posters` mini flyer
  `preview`

Latest repo-level confidence check:

- `npm run test:unit`
- `npm run brand:audit-source`
- `npm run brand:verify`
- `npm run brand:preview`
- `npm run brand:client-collateral`

These passed on 2026-06-28, which means the current generator set is in a healthy operational state even though several families still need real-world proof before promotion.

## Guardrails And Themes

Brand feel now has two explicit design-system layers:

- `guardrails`
  reusable brand-behavior rules such as core tension, visual DNA, tone rules, preservation rules, and anti-patterns
- `themes`
  named palette-level variants like `default`, `synthwave`, `winter`, `conference`, `minimal-print`, and `holiday`

Important constraint:

- theme variants are meant to be safe palette-level overrides, not permission to rewrite layouts or ignore the brand guardrails

Current practical usage:

- generate one themed asset with shell env:
  `BRAND_THEME=conference npm run brand:og`
- generate theme preview sheets for all registered variants:
  `npm run brand:preview:themes`

The all-themes sweep currently focuses on the hero-composition family and the work-with-me document/contact surfaces that already derive from the shared theme-aware system.

## Common Workflows

Use these most often:

```bash
npm run brand:verify
npm run brand:audit-source
npm run brand:preview
npm run asset:networking
npm run review:packet
```

- `brand:verify` now checks business-card source-of-truth details plus social hero manifests/preflight metadata for OG, LinkedIn, and GitHub outputs.
- `brand:verify` is the main preflight command before trusting outputs for real use. It now checks business-card source-of-truth details plus manifest/preflight coverage for social hero outputs, website hero, icons, email signature, and capability sheet.
- `brand:audit-source` is a reusable-code hygiene check. Its purpose is to catch places where shared code still leaks ArcadeGhosts-specific strings so the repo can become genuinely multi-brand over time, without blocking normal work yet.
- `asset:networking` generates the current phone-first meetup stack: conference card, lock screen, wallet pass package, business-card support outputs, and QR verification.
- `review:packet` packages the networking assets for human or ChatGPT review.
- `brand:preview` generates the current output set and refreshes the multi-output review page.
- `brand:packet:client-collateral` gathers the current first-client collateral stack into a review-friendly packet.
- `asset:networking` generates the meetup-ready networking assets, business-card regeneration support, and QR verification in one path.
- `qr:verify` programmatically decodes the generated networking QR assets and confirms they still point to the expected URL.
- `review:packet` gathers the networking assets into a review-friendly packet.

Useful extra workflows:

- `npm run brand:verify:social`
- `npm run brand:verify:business-cards`
- `npm run brand:verify:website`
- `npm run brand:verify:icons`
- `npm run brand:verify:email`
- `npm run brand:verify:capability-sheet`
- `npm run asset:conference-card`
- `npm run asset:lock-screen`
- `npm run asset:networking`
- `npm run qr:verify`
- `npm run review:packet`
- `npm run brand:preview:themes`
- `npm run test:unit`

The review page is written to:

- [generators/outputs/preview/arcadeghosts-preview-sheet.html](generators/outputs/preview/arcadeghosts-preview-sheet.html)

## Generated outputs

Generated files such as export images, PDFs, and manifest files are intentionally ignored by Git so the repo stays focused on source assets and instructions.

That includes proof exports under brand copy folders such as `brands/arcadeghosts/copy/exports/`.
Keep the source copy tracked, but regenerate proofs locally when needed.
Business-card `export-manifest.json` files are generated proof metadata and should be refreshed locally instead of hand-editing them.
Social manifests are written next to their PNG/SVG outputs under `generators/outputs/social/`.
Website hero and icon manifests are written next to their generated outputs under `generators/outputs/website/` and `generators/outputs/icons/`.

## Workflow Docs

Start here for end-to-end output handoff guidance:

- [docs/vendor-handoffs.md](docs/vendor-handoffs.md)

Useful specialized docs:

- [docs/repo-map.md](docs/repo-map.md)
- [docs/CLIENT-COLLATERAL.md](docs/CLIENT-COLLATERAL.md)
- [docs/networking-assets.md](docs/networking-assets.md)
- [docs/BUSINESS-LINKS-CONTRACT.md](docs/BUSINESS-LINKS-CONTRACT.md)
- [docs/PRODUCTION-CHECKLIST.md](docs/PRODUCTION-CHECKLIST.md)
- [docs/BUSINESS-CARD-PRODUCTION-CHECKLIST.md](docs/BUSINESS-CARD-PRODUCTION-CHECKLIST.md)
- [docs/FIRST-CLIENT-CHECKLIST.md](docs/FIRST-CLIENT-CHECKLIST.md)
- [docs/OUTPUTS-AND-REVIEW-PACKETS.md](docs/OUTPUTS-AND-REVIEW-PACKETS.md)
- [docs/ARCADEGHOSTS-WORK-WITH-ME-HANDOFF.md](docs/ARCADEGHOSTS-WORK-WITH-ME-HANDOFF.md)
- [docs/add-output.md](docs/add-output.md)
- [docs/add-brand.md](docs/add-brand.md)
- [generators/client-collateral/README.md](generators/client-collateral/README.md)
- [generators/business-cards/generator/README.md](generators/business-cards/generator/README.md)
- [brands/arcadeghosts/workflows/MOO-upload-checklist.md](brands/arcadeghosts/workflows/MOO-upload-checklist.md)
- [brands/arcadeghosts/theme-variants.md](brands/arcadeghosts/theme-variants.md)
- [generators/networking/README.md](generators/networking/README.md)
- [generators/website/README.md](generators/website/README.md)
- generator-family upload notes under `generators/*/README.md`

The docs are split roughly like this:

- `CLIENT-COLLATERAL.md`
  collateral set, maturity, and customer-journey fit
- `BUSINESS-LINKS-CONTRACT.md`
  logical CTA/link contract between Brand Kit and consumer repos
- `OUTPUTS-AND-REVIEW-PACKETS.md`
  where generated outputs live and how to assemble review packets
- `FIRST-CLIENT-CHECKLIST.md`
  operational bundle checklist before using Brand Kit in real outreach
- `ARCADEGHOSTS-WORK-WITH-ME-HANDOFF.md`
  ArcadeGhosts-specific handoff expectations for lead-generation use

## Testing

Unit tests live under:

- `tests/unit/`

Run them with:

```bash
npm run test:unit
```

Useful verification commands:

```bash
npm run brand:verify
npm run brand:verify:social
npm run brand:audit-source
```

Current test coverage is intentionally focused on design-system and helper logic rather than full generator rendering.

## Historical Folders

These folders are intentionally not active source of truth:

- [archive/README.md](archive/README.md)
- [vschats/README.md](vschats/README.md)

## Local Machine Paths

Do not store absolute local repo paths as tracked source files.

For machine-specific integration details, use:

- tracked examples under `integrations/`
- ignored local overrides such as `integrations/*.local.json`
