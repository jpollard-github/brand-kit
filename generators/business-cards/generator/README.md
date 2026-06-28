# Business Card Export Generator

This generator creates deterministic business card exports without relying on visual design tools.

## Command

```bash
npm run brand:business-cards
npm run brand:verify
```

Optional flags:

```bash
npm run brand:business-cards -- --guides
npm run brand:business-cards -- --pdf
npm run brand:business-cards -- --guides --pdf
```

## What It Does

- reads the existing copy files from `work-with-me/` and `arcadeghosts/`
- uses the shared logo and QR SVG assets
- renders four HTML/CSS card layouts at bleed size: `1110 x 660`
- exports:
  - `work-with-me/exports/front-final.png`
  - `work-with-me/exports/back-final.png`
  - `arcadeghosts/exports/front-final.png`
  - `arcadeghosts/exports/back-final.png`
- optionally exports matching PDFs
- writes `export-manifest.json` files next to the exports
- writes a local preview page at `generators/business-cards/generator/cards.html`
- verifies the canonical domain, printed URLs, contact email, and QR targets before export

## Notes

- the canvas includes bleed
- the inner trim area is `1050 x 600`
- text stays live HTML text until Playwright renders the final PNG
- final PNGs are the files intended for MOO upload
- QR code contents are not changed by the generator
- `--guides` produces `*-guides.png` proof exports with trim/safe-area overlays for review only
- `--pdf` produces matching PDFs for review/proofing unless MOO specifically asks for PDF
- QR codes should be scanned manually before ordering any print run

## Verification

Run:

```bash
npm run brand:verify
```

This checks:

- `homeUrl` and `workWithMeUrl` stay on the canonical domain
- printed URLs match the expected `.org` values
- the printed email matches the configured contact email
- QR SVG targets match the brand URLs
- printed URLs and QR targets agree
- exported PNGs exist at `1110 x 660`
- guide PNGs and proof PDFs exist

## Editing

The main knobs live in:

- `theme.ts` for dimensions, palette, typography, shadows, QR sizing, and percentage boxes
- `export-cards.ts` for composition and export behavior

If you want a different mood later, tweak CSS gradients and spacing there, then rerun the command.
