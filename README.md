# Brand Kit

This repository is a generator-based brand toolkit for ArcadeGhosts, client-facing collateral, and related brand surfaces.

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
4. [brands/arcadeghosts/README.md](brands/arcadeghosts/README.md)
5. [brands/arcadeghosts/what-makes-arcadeghosts.md](brands/arcadeghosts/what-makes-arcadeghosts.md)
6. [brands/arcadeghosts/theme-variants.md](brands/arcadeghosts/theme-variants.md)
7. [design-system/brand-config.ts](design-system/brand-config.ts)
8. [generators/social/hero-composition.ts](generators/social/hero-composition.ts)

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

## Brand-agnostic direction

The repo is now structured to support a shared design-system layer that can be reused across multiple brands and output types.

- Brand configuration lives under the design-system folder.
- The current ArcadeGhosts brand is preserved as the default brand.
- Brand-specific reference material lives under the brands folder, with a dedicated ArcadeGhosts folder for the current implementation.
- Future brands can be introduced by adding brand config and copy data without replacing the current workflow.

## Output-agnostic direction

The generator entry points are now set up to be more general than business cards alone.

- Cards: `npm run brand:business-cards`
- Stickers: `npm run brand:stickers`
- Sticker sheet: `npm run brand:sticker-sheet`
- Mugs: `npm run brand:mugs`
- Shirts: `npm run brand:shirts`
- Icons: `npm run brand:icons`
- OG / LinkedIn / GitHub social: `npm run brand:og`, `npm run brand:linkedin`, `npm run brand:github-social`
- Website hero / handoff: `npm run brand:website-hero`, `npm run brand:website-handoff`
- Newsletter / project cover / presentation cover: `npm run brand:newsletter`, `npm run brand:project-cover`, `npm run brand:presentation-cover`
- Conference badge / mini flyer / wallpapers: `npm run brand:conference-badge`, `npm run brand:mini-flyer`, `npm run brand:wallpapers`
- Tote / stream thumbnail: `npm run brand:totes`, `npm run brand:stream-thumbnail`
- Documents / stationery: `npm run brand:documents`
- Email signature: `npm run brand:email-signature`
- Full preview: `npm run brand:preview`
- Theme preview sweep: `npm run brand:preview:themes`
- Generator implementations live under the generators folder, with business cards as the first generator family.
- Additional output-oriented commands can be introduced as new generators are added.

## Scene Families

The repo now has two primary scene families for ArcadeGhosts:

- `ArcadeGhosts Hero`
  This is the expressive brand/world scene and should drive:
  OG image, LinkedIn banner, GitHub social, website hero, newsletter header, project cover, presentation cover, wallpapers, mini flyer, and stream thumbnail.
- `Work With Me Hero`
  This is the clearer service/contact scene and should drive:
  email signature, conference badge, letterhead, invoice, and any future client-facing service collateral.

The goal is to adapt one composition family across aspect ratios instead of redesigning the same idea from scratch for every surface.

## Generator Maturity

Use these labels as workflow expectations, not as a judgment on visual quality:

- `Production Ready`
  business cards plus the current verification path
- `Production Candidate`
  OG image, LinkedIn banner, GitHub social, website hero, icons, newsletter header, project cover, presentation cover, conference badge, mini flyer, wallpapers, documents, email signature, and preview sheet
  Social hero outputs, website hero, and icons now include manifest and preflight support, but still need broader workflow proof before they move above `Production Candidate`.
- `Proof of Concept`
  stickers, sticker sheet, mugs, shirts, totes, stream thumbnail, and website handoff staging
- `Scaffold`
  shared multi-brand abstractions that still need validation against a second real brand
- `Archived`
  material under `archive/` and historical conversations under `vschats/`

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
```

- `brand:verify` now checks business-card source-of-truth details plus social hero manifests/preflight metadata for OG, LinkedIn, and GitHub outputs.
- `brand:verify` is the main preflight command before trusting outputs for real use. It now checks business-card source-of-truth details plus manifest/preflight coverage for social hero outputs, website hero, and icons.
- `brand:audit-source` is a reusable-code hygiene check. Its purpose is to catch places where shared code still leaks ArcadeGhosts-specific strings so the repo can become genuinely multi-brand over time, without blocking normal work yet.
- `brand:preview` generates the current output set and refreshes the multi-output review page.

Useful extra workflows:

- `npm run brand:verify:social`
- `npm run brand:verify:business-cards`
- `npm run brand:verify:website`
- `npm run brand:verify:icons`
- `npm run brand:preview:themes`
- `npm run test:unit`

The review page is written to:

- [generators/outputs/preview/arcadeghosts-preview-sheet.html](generators/outputs/preview/arcadeghosts-preview-sheet.html)

## Generated outputs

Generated files such as export images, PDFs, and manifest files are intentionally ignored by Git so the repo stays focused on source assets and instructions.

That includes proof exports under brand copy folders such as `brands/arcadeghosts/copy/exports/`.
Keep the source copy tracked, but regenerate proofs locally when needed.
Social manifests are written next to their PNG/SVG outputs under `generators/outputs/social/`.
Website hero and icon manifests are written next to their generated outputs under `generators/outputs/website/` and `generators/outputs/icons/`.

## Workflow Docs

Start here for end-to-end output handoff guidance:

- [docs/vendor-handoffs.md](docs/vendor-handoffs.md)

Useful specialized docs:

- [docs/repo-map.md](docs/repo-map.md)
- [docs/CLIENT-COLLATERAL.md](docs/CLIENT-COLLATERAL.md)
- [docs/add-output.md](docs/add-output.md)
- [docs/add-brand.md](docs/add-brand.md)
- [generators/business-cards/generator/README.md](generators/business-cards/generator/README.md)
- [brands/arcadeghosts/workflows/MOO-upload-checklist.md](brands/arcadeghosts/workflows/MOO-upload-checklist.md)
- [brands/arcadeghosts/theme-variants.md](brands/arcadeghosts/theme-variants.md)
- [generators/website/README.md](generators/website/README.md)
- generator-family upload notes under `generators/*/README.md`

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
