# Brand Generator TODO

Reference: 2026-06-28 EDT

This TODO now tracks the active build-out of `brand-kit` as the dedicated home for the generator system.

Repo context: the rename and archive work is largely complete, so the remaining TODOs should focus on brand extraction, new outputs, and cleaner reuse.

Working direction:

- build a `Brand Generator`
- treat merchandise as one output category, not the whole system
- keep ArcadeGhosts as the first live brand implementation
- leave room for future client-facing reuse

Useful context from MERCH.md:

- keep business cards as the first concrete deliverable
- treat personal ArcadeGhosts cards and a small merch test batch as the next steps
- business cards for both business and personal use have been ordered from MOO
- use MOO for cards and Printify/Fourthwall for merch experiments
- avoid building a merch page into the site until the product set is proven

## Current Next Wave

- [x] Add explicit business-card URL/domain verification so `.com` regressions fail fast
- [x] Add a first `npm run brand:verify` pre-flight check for business cards
- [x] Extract the real ArcadeGhosts palette from the website and reconcile it with `design-system/colors.ts`
- [x] Extract the real website metadata/summary language and reconcile it with `design-system/metadata.ts`
- [ ] Add explicit logo usage rules so future generators use the brand mark consistently
- [ ] Add the first social/web asset generator, likely starting with GitHub social image or OG image output
- [ ] Expand the preview sheet to include at least one social/web asset alongside print outputs

## Recommended Rename

- [x] Rename `merch/` to `brand/`, `brand-kit/`, or `brand-generator/`
- [x] Move it into a sibling private repo outside this website repo
- [x] Keep a note in this site repo pointing to the new location once moved
- [x] Decide that generated outputs will stay gitignored locally and not be committed to the repo

## Highest Priority

- [x] Preserve ArcadeGhosts website brand context in the moved repo
- [x] Extract a reusable design-system layer from the current business card generator
- [x] Separate brand tokens from generator-specific rendering logic
- [x] Keep the current business cards working as the first proof that the architecture is real

## Before The Move

- [x] Carry over [brands/arcadeghosts/site-reference.md](/Users/jasonp/repos/brand-kit/brands/arcadeghosts/site-reference.md)
- [x] Carry over the business card generator source files and docs
- [x] Carry over the current logo assets and QR assets
- [x] Carry over the MOO workflow docs and generator docs
- [x] Keep `docs/MERCH.md` material as site-history context and preserve the actionable brand-kit details in the new repo

## Proposed Future Structure

- [x] Create a top-level structure like:
      `brands/`
      `design-system/`
      `assets/`
      `generators/`
      `outputs/`
      `personas/`
- [x] Move business cards under `generators/business-cards/`
- [x] Create a shared `design-system/` folder for:
  - colors
  - typography
  - spacing
  - layout helpers
  - metadata
  - brand copy
- [x] Decide that generated `outputs/` should stay local-only and be gitignored

## Design System Extraction

- [x] Extract ArcadeGhosts color tokens from `app/globals.css`
- [x] Extract metadata and summary language from `app/seo.ts`
- [ ] Extract reusable logo references and usage rules
- [ ] Extract tone rules:
  - professional but personal
  - neon but readable
  - atmospheric but not cluttered
- [x] Add a document that explains what makes ArcadeGhosts feel like ArcadeGhosts

## Generators To Keep / Expand

- [x] Keep the business-card generator as the first stable generator
- [x] Add a sticker generator
- [x] Add mug layout generation
- [x] Add shirt graphic generation
- [ ] Add social graphic generation
- [ ] Add LinkedIn banner generation
- [ ] Add GitHub social image generation
- [ ] Add website asset generation
- [ ] Add presentation slide / deck cover generation
- [ ] Add email signature generation
- [ ] Add conference badge generation
- [ ] Add invoice / letterhead generation if the side-hustle work grows

## Cohesion Preview

- [x] Add a single command like `npm run brand:preview`
- [x] Generate a first multi-output preview sheet for:
  - business cards
  - sticker
  - mug
  - shirt
- [ ] Expand the preview sheet later to include:
  - social banner
  - OG image
  - email signature
- [x] Make it easy to review whether the whole brand still feels cohesive in one pass

## Repo Hygiene

- [x] Split ArcadeGhosts card copy into canonical per-card source files under `brands/arcadeghosts/copy/`
- [ ] Decide whether `brands/arcadeghosts/copy/exports/` should stay as tracked reference artifacts or be removed from the repo history and regenerated locally
- [ ] Add a short README note explaining which files are canonical source, which are generated outputs, and which folders are archive/history only
- [ ] Consider removing tracked `.DS_Store` artifacts from active generator folders

## Theme Variants

- [ ] Explore theme variants without losing ArcadeGhosts identity
- [ ] Prototype ideas like:
  - `synthwave`
  - `winter`
  - `conference`
  - `minimal print`
  - `holiday`
- [ ] Add a safe system for theme overrides instead of one-off hacks

## Website Integration

- [ ] Decide whether the site should consume shared brand tokens from the future repo
- [ ] Identify which website assets should eventually be brand-generator outputs:
  - opengraph images
  - social preview art
  - logos
  - hero support graphics
  - print / PDF handoff materials
- [ ] Decide whether to import brand outputs into the site build or copy them in manually

## Persona / Brand Review

- [ ] Connect future persona testing to brand review
- [ ] Test whether different personas respond consistently across:
  - website
  - business cards
  - social graphics
  - print materials
- [ ] Add a notion of `brand coherence` alongside usability and interest

## Product Thinking

- [ ] Decide whether this stays internal to ArcadeGhosts and your side hustle
- [ ] Explore whether a future version could support client brands
- [ ] Identify what would need to become configurable for clients:
  - logo input
  - palette
  - typography
  - metadata
  - output templates
- [ ] Keep the first version focused on ArcadeGhosts before generalizing too early

## Practical First Steps After Rename

- [x] Move the current generator with no structural breakage
- [x] Recreate `npm run merch:cards` as `npm run brand:business-cards` or similar
- [x] Add `npm run brand:preview`
- [x] Create `design-system/colors.ts`
- [x] Create `design-system/metadata.ts`
- [x] Create `design-system/typography.ts`
- [x] Add the first non-card generator, using a Printify-ready sticker placeholder workflow
- [x] Move current ArcadeGhosts brand material into `brands/arcadeghosts/` for generator consumption
- [x] Slim down or remove the legacy `business-cards/` compatibility copy once `generators/business-cards/` is fully settled
- [x] Decide that `for-me/` can move to `archive/` now that mug and shirt generators are first-class outputs

## Current Working Decisions

- [x] Keep ArcadeGhosts as the first canonical brand under `brands/arcadeghosts/`
- [x] Keep `brands/arcadeghosts/site-reference.md` as the current home for website-derived brand context
- [x] Archive the duplicate root `arcadeghosts-site-reference.md` and keep `brands/arcadeghosts/site-reference.md` as the canonical reference

## Constraints To Preserve

- [x] Fail business-card export if URLs, QR targets, or contact email drift from the brand config
- [ ] Keep deterministic exports
- [ ] Keep real text where possible
- [ ] Keep print-friendly PNG/PDF outputs
- [ ] Keep guide overlays for proofing
- [ ] Do not silently drift away from the live ArcadeGhosts website identity
- [ ] Favor reusable tokens over hard-coded one-off styles
