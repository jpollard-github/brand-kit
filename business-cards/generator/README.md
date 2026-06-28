# Business Card Export Generator

This generator creates deterministic business card exports without relying on visual design tools.

## Command

```bash
npm run merch:cards
```

Optional flags:

```bash
npm run merch:cards -- --guides
npm run merch:cards -- --pdf
npm run merch:cards -- --guides --pdf
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
- writes a local preview page at `merch/business-cards/generator/cards.html`

## Notes

- the canvas includes bleed
- the inner trim area is `1050 x 600`
- text stays live HTML text until Playwright renders the final PNG
- final PNGs are the files intended for MOO upload
- QR code contents are not changed by the generator
- `--guides` produces `*-guides.png` proof exports with trim/safe-area overlays for review only
- `--pdf` produces matching PDFs for review/proofing unless MOO specifically asks for PDF
- QR codes should be scanned manually before ordering any print run

## Editing

The main knobs live in:

- `theme.ts` for dimensions, palette, typography, shadows, QR sizing, and percentage boxes
- `export-cards.ts` for composition and export behavior

If you want a different mood later, tweak CSS gradients and spacing there, then rerun the command.
