This folder is the canonical source for ArcadeGhosts business-card copy.

Use the split card-specific files:

- `work-with-me/front-copy.txt`
- `work-with-me/back-copy.txt`
- `arcadeghosts/front-copy.txt`
- `arcadeghosts/back-copy.txt`

The generator falls back to `generators/business-cards/` only if these brand-level files are missing.

Source-of-truth note:

- Keep the copy text and specs here under version control.
- Treat `copy/exports/` as generated proof output, not canonical source.
- If proofs are needed again, regenerate them locally instead of treating old exports as authoritative.
