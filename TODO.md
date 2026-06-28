# Brand Generator TODO

Reference: 2026-06-28 EDT

This TODO assumes the current merch workspace is being renamed and moved into the new brand-kit repo as a dedicated home for the brand system.

Repo context: this workspace is now the brand-kit repo, so the rename and handoff planning is centered here.

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

## Recommended Rename

- [x] Rename `merch/` to `brand/`, `brand-kit/`, or `brand-generator/`
- [x] Move it into a sibling private repo outside this website repo
- [x] Keep a note in this site repo pointing to the new location once moved
- [ ] Decide whether generated outputs stay gitignored there or become selectively committed

## Highest Priority

- [ ] Preserve ArcadeGhosts website brand context in the moved repo
- [ ] Extract a reusable design-system layer from the current business card generator
- [ ] Separate brand tokens from generator-specific rendering logic
- [ ] Keep the current business cards working as the first proof that the architecture is real

## Before The Move

- [ ] Carry over [arcadeghosts-site-reference.md](/Users/jasonp/repos/personal/merch/arcadeghosts-site-reference.md)
- [ ] Carry over the business card generator source files and docs
- [ ] Carry over the current logo assets and QR assets
- [ ] Carry over the MOO workflow docs and generator docs
- [x] Keep `docs/MERCH.md` material as site-history context and preserve the actionable brand-kit details in the new repo

## Proposed Future Structure

- [ ] Create a top-level structure like:
      `brand/`
      `design-system/`
      `assets/`
      `generators/`
      `outputs/`
      `personas/`
- [ ] Move business cards under `generators/business-cards/`
- [ ] Create a shared `design-system/` folder for:
  - colors
  - typography
  - spacing
  - layout helpers
  - metadata
  - brand copy
- [ ] Decide whether `outputs/` should be generated locally only or partly committed

## Design System Extraction

- [ ] Extract ArcadeGhosts color tokens from `app/globals.css`
- [ ] Extract metadata and summary language from `app/seo.ts`
- [ ] Extract reusable logo references and usage rules
- [ ] Extract tone rules:
  - professional but personal
  - neon but readable
  - atmospheric but not cluttered
- [ ] Add a document that explains what makes ArcadeGhosts feel like ArcadeGhosts

## Generators To Keep / Expand

- [ ] Keep `business-cards/` as the first stable generator
- [ ] Add a sticker generator
- [ ] Add mug layout generation
- [ ] Add shirt graphic generation
- [ ] Add social graphic generation
- [ ] Add LinkedIn banner generation
- [ ] Add GitHub social image generation
- [ ] Add website asset generation
- [ ] Add presentation slide / deck cover generation
- [ ] Add email signature generation
- [ ] Add conference badge generation
- [ ] Add invoice / letterhead generation if the side-hustle work grows

## Cohesion Preview

- [ ] Add a single command like `npm run brand:preview`
- [ ] Generate a multi-output preview sheet for:
  - business cards
  - sticker
  - mug
  - shirt
  - social banner
  - OG image
  - email signature
- [ ] Make it easy to review whether the whole brand still feels cohesive in one pass

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

- [ ] Move the current generator with no structural breakage
- [ ] Recreate `npm run merch:cards` as `npm run brand:business-cards` or similar
- [ ] Add `npm run brand:preview`
- [ ] Create `design-system/colors.ts`
- [ ] Create `design-system/metadata.ts`
- [ ] Create `design-system/typography.ts`
- [ ] Add the first non-card generator, probably stickers or social graphics

## Constraints To Preserve

- [ ] Keep deterministic exports
- [ ] Keep real text where possible
- [ ] Keep print-friendly PNG/PDF outputs
- [ ] Keep guide overlays for proofing
- [ ] Do not silently drift away from the live ArcadeGhosts website identity
- [ ] Favor reusable tokens over hard-coded one-off styles
