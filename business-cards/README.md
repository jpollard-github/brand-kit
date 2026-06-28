# Business Card Pack

This folder is intentionally gitignored so you can keep working files, print exports, and experiments here without cluttering the repo.

Important migration context:

- [../TODO.md](/Users/jasonp/repos/personal/merch/TODO.md)
- [../arcadeghosts-site-reference.md](/Users/jasonp/repos/personal/merch/arcadeghosts-site-reference.md)

Those files capture the larger brand-generator direction and the ArcadeGhosts website references that currently live outside `merch/`.

Included here:

- reusable logo assets copied from the site
- QR code assets for `Work With Me` and `ArcadeGhosts`
- print-ready copy for both card types
- a deterministic generator for print-ready exports
- card specs and ordering notes for MOO

Recommended export workflow:

1. use the copy files in each card folder
2. run `npm run merch:cards -- --guides --pdf`
3. review the clean PNGs, guide PNGs, and proof PDFs
4. upload the clean `front-final.png` and `back-final.png` files to MOO
5. keep generated exports in the matching `exports/` folder

Suggested local structure:

- `shared-assets/`
- `generator/`
- `work-with-me/`
- `arcadeghosts/`

If you iterate on designs, keep versions like:

- `front-v1.png`
- `front-v2.png`
- `back-v1.png`

Generator reference:

- `generator/README.md`
- `MOO-upload-checklist.md`

## Card Size Reminder

For MOO standard cards, double-check the current template before final export.
Do not assume the bleed/safe area from memory.
