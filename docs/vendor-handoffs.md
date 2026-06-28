# Vendor Handoffs

This is the practical end-to-end handoff guide for turning `brand-kit` outputs into real uploads for printers, merch vendors, or website repos.

It is intentionally one central doc with sections per output family.

Reasoning:

- the core workflow is mostly the same across outputs
- one central doc is easier to maintain than many tiny fragmented notes
- brand-specific exceptions can still live in `brands/arcadeghosts/workflows/`

Use this doc as the first stop, then jump to the more specific checklist if one exists.

## Core Workflow

For almost every output, the flow is:

1. Generate the asset.
2. Review it locally.
3. Verify dimensions, URLs, and readable text.
4. Export or upload the right file type for the vendor.
5. Review the vendor preview before ordering or publishing.

Recommended repo-level commands:

```bash
npm run brand:preview
npm run brand:verify
```

Use `brand:preview` when you want a broad visual pass.

Use `brand:verify` before any business-card print order.

## Command Map

Current generators:

- `npm run brand:business-cards`
- `npm run brand:business-cards:guides`
- `npm run brand:business-cards:pdf`
- `npm run brand:stickers`
- `npm run brand:sticker-sheet`
- `npm run brand:mugs`
- `npm run brand:shirts`
- `npm run brand:totes`
- `npm run brand:icons`
- `npm run brand:og`
- `npm run brand:linkedin`
- `npm run brand:github-social`
- `npm run brand:website-hero`
- `npm run brand:newsletter`
- `npm run brand:project-cover`
- `npm run brand:presentation-cover`
- `npm run brand:conference-badge`
- `npm run brand:mini-flyer`
- `npm run brand:wallpapers`
- `npm run brand:stream-thumbnail`
- `npm run brand:documents`
- `npm run brand:email-signature`
- `npm run brand:website-handoff`
- `npm run brand:preview-sheet`
- `npm run brand:preview`

## Output Types

### Business Cards

Best fit:

- `MOO`
- other business-card printers with similar PNG/PDF upload flows

Generate:

```bash
npm run brand:business-cards
npm run brand:business-cards:pdf
```

Primary files:

- clean PNGs from `generators/business-cards/*/exports/`
- optional review PDFs

Checklist:

- run `npm run brand:verify`
- scan QR codes
- verify printed URL is `.org`
- confirm name, email, and role
- use clean final PNGs for upload unless the vendor explicitly requires PDF

More detail:

- [generators/business-cards/generator/README.md](../generators/business-cards/generator/README.md)
- [brands/arcadeghosts/workflows/MOO-upload-checklist.md](../brands/arcadeghosts/workflows/MOO-upload-checklist.md)

### Stickers

Best fit:

- `Printify`
- `Fourthwall`
- sticker printers with simple rectangular or kiss-cut upload steps

Generate:

```bash
npm run brand:stickers
npm run brand:sticker-sheet
```

Primary files:

- `generators/outputs/stickers/arcadeghosts-sticker-set.svg`
- `generators/outputs/stickers/arcadeghosts-sticker-sheet.png`

Recommended use:

- use the single sticker art for the actual vendor upload
- use the sticker sheet as a proofing or small-batch planning artifact, not as the direct vendor upload unless the vendor explicitly wants a full sheet

Before upload:

- confirm the vendor wants SVG or PNG
- if unsure, export or convert to high-resolution PNG
- confirm edge padding is acceptable in the vendor preview
- check dark background richness and text readability

### Mugs

Best fit:

- `Printify`
- other POD mug vendors with wrap uploads

Generate:

```bash
npm run brand:mugs
```

Primary files:

- `generators/outputs/mugs/arcadeghosts-mug-wrap.svg`
- optional side-specific SVGs

Before upload:

- confirm the vendor’s mug wrap dimensions
- verify left/right safe area and handle gap
- check that logo and text do not land too close to seams
- export a flattened PNG if the vendor does not accept SVG cleanly

### Shirts

Best fit:

- `Printify`
- `Fourthwall`
- shirt vendors supporting separate front and back art

Generate:

```bash
npm run brand:shirts
```

Primary files:

- `generators/outputs/shirts/arcadeghosts-shirt-front.svg`
- `generators/outputs/shirts/arcadeghosts-shirt-back.svg`

Before upload:

- verify the chosen shirt style supports both front and back placements if needed
- check scale on the vendor mockup
- confirm dark garment compatibility
- flatten to PNG if the vendor’s SVG handling is unreliable

### Totes

Best fit:

- `Printify`
- `Fourthwall`
- other tote-bag vendors supporting separate front/back uploads

Generate:

```bash
npm run brand:totes
```

Primary files:

- `generators/outputs/totes/arcadeghosts-tote-front.svg`
- `generators/outputs/totes/arcadeghosts-tote-back.svg`

Before upload:

- confirm the tote template supports one-sided or two-sided art as expected
- verify the artwork does not sit too close to the printable bounds
- flatten to PNG if the vendor’s SVG support is unreliable

### Posters / Flyers / Badges

Best fit:

- local print shops
- office printers
- generic digital print vendors

Generate:

```bash
npm run brand:mini-flyer
npm run brand:conference-badge
npm run brand:presentation-cover
```

Primary files:

- `generators/outputs/posters/arcadeghosts-mini-flyer.png`
- `generators/outputs/badges/arcadeghosts-conference-badge.png`
- `generators/outputs/presentations/arcadeghosts-presentation-cover.png`

Before print:

- confirm physical size requirements
- confirm bleed and trim expectations
- confirm the vendor wants RGB PNG or print PDF
- proof small text at actual size

### Documents / Stationery

Best fit:

- PDF-export workflows
- client-facing proposals
- manual invoices
- lightweight branded documents

Generate:

```bash
npm run brand:documents
```

Primary files:

- `generators/outputs/documents/arcadeghosts-letterhead.svg`
- `generators/outputs/documents/arcadeghosts-letterhead.png`
- `generators/outputs/documents/arcadeghosts-invoice.svg`
- `generators/outputs/documents/arcadeghosts-invoice.png`

Before use:

- treat these as branded shells, not authoritative accounting records
- replace placeholder billing details with real data
- export to PDF if the client or printer expects a document instead of an image
- confirm body text remains readable when printed on light paper

### Social / Website / Digital

Best fit:

- website repos
- social profiles
- repo covers
- newsletter tooling

Generate:

```bash
npm run brand:og
npm run brand:linkedin
npm run brand:github-social
npm run brand:website-hero
npm run brand:newsletter
npm run brand:project-cover
npm run brand:wallpapers
npm run brand:stream-thumbnail
npm run brand:icons
npm run brand:email-signature
npm run brand:website-handoff
```

Primary files:

- social PNGs from `generators/outputs/social/`
- website PNGs from `generators/outputs/website/`
- icon files from `generators/outputs/icons/`
- wallpaper files from `generators/outputs/wallpapers/`
- video thumbnail PNG/SVG from `generators/outputs/video/`
- stationery PNG/SVG from `generators/outputs/documents/`
- email signature HTML/PNG from `generators/outputs/email/`

Website handoff flow:

1. run `npm run brand:website-handoff`
2. inspect `generators/outputs/website/website-handoff/`
3. review the checklist and manifest
4. copy into the website repo intentionally
5. preview locally before committing

More detail:

- [generators/website/README.md](../generators/website/README.md)
- [integrations/README.md](../integrations/README.md)

## Printify vs Other Vendors

Use `Printify` when:

- you want straightforward POD for mugs, shirts, or stickers
- the product template already matches the generated shape reasonably well
- you are comfortable doing final fit checks inside the vendor UI

Use another vendor when:

- you need exact print specs, bleed control, or premium stock
- the vendor has special trim or dieline requirements
- the product surface is more specialized than a basic POD template

The safe default:

- generate here
- inspect locally
- flatten to PNG when vendor SVG support is uncertain
- trust the vendor preview only after checking margins, text size, and crop

## Per-Output Docs Strategy

Current recommendation:

- keep one central doc here for the shared workflow
- keep specialized brand/vendor docs only where they add real value

That means:

- central workflow: `docs/vendor-handoffs.md`
- business-card specifics: `brands/arcadeghosts/workflows/MOO-upload-checklist.md`
- website repo specifics: `generators/website/README.md`

If another output gets truly complicated later, add a focused doc for that output family instead of splitting everything preemptively.
