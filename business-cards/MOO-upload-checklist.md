# MOO Upload Checklist

Reference: 2026-06-27 23:35 EDT

Use this after generating the card exports locally.

Pair this with:

- `merch/business-cards/generator/README.md`
- `merch/business-cards/layout-spec.md`
- `merch/business-cards/layout-percentages.md`
- `https://www.moo.com/`

## Goal

Move from generated card exports to a small, low-risk first print order.

## 1. Files To Generate First

Run:

```bash
npm run merch:cards -- --guides --pdf
```

That gives you:

- clean final PNGs for upload
- guide PNGs for trim/safe-area review
- guide PDFs for proofing/reference

### Work With Me

- `front-final.png`
- `back-final.png`
- `front-final-guides.png`
- `back-final-guides.png`
- `front-final-guides.pdf`
- `back-final-guides.pdf`

Save in:

- `merch/business-cards/work-with-me/exports/`

### ArcadeGhosts

- `front-final.png`
- `back-final.png`
- `front-final-guides.png`
- `back-final-guides.png`
- `front-final-guides.pdf`
- `back-final-guides.pdf`

Save in:

- `merch/business-cards/arcadeghosts/exports/`

## 2. Which Files Go To MOO

Use these for actual MOO upload:

- `front-final.png`
- `back-final.png`

Use these only for review/proofing:

- `*-guides.png`
- `*-guides.pdf`

Notes:

1. the clean final PNGs are the source files intended for MOO
2. the guide PNGs help you visually check trim and safe-area boundaries
3. the PDFs are review/proof files unless MOO specifically asks for PDF
4. do not rename the files vaguely like `card-final-final-2`

## 3. Before You Open MOO

Check the exported files locally:

- open the clean final PNGs and confirm they look polished without overlays
- open the guide PNGs and confirm all important content sits inside trim/safe area
- zoom in and make sure text edges look clean
- confirm the QR code is crisp, high-contrast, and not blurry
- confirm the background is intentional, not accidentally flat or washed out
- confirm the left alignment still looks consistent in the export
- manually scan both QR codes with your phone before ordering

## 4. What To Order First In MOO

Use a simple first order.

Recommended starting point:

- `Original Business Cards`
- standard size
- matte or soft-touch if available and affordable
- no fancy finish required for the first test

Reason:

- you are validating readability and mood first
- you do not need to pay for premium finishes before seeing them in hand

## 5. Upload Order In MOO

Do them one card at a time.

### First Card To Upload

`Work With Me`

Upload:

1. `front-final.png`
2. `back-final.png`

Why first:

- it is the more practical card
- if anything feels too small or crowded, you will notice quickly

### Second Card To Upload

`ArcadeGhosts`

Upload:

1. `front-final.png`
2. `back-final.png`

## 6. What To Check In The MOO Preview

Look for these things carefully:

- is any text too close to the trim edge?
- is any text inside the bleed danger zone?
- is the QR code fully inside the safe area?
- is the QR code still large enough to scan?
- does the darkest background still preserve the text contrast?
- does anything feel unexpectedly tiny?

If something feels even a little cramped:

- go back to the generator theme/layout and add more breathing room

## 7. Exact Card-Specific Preview Checks

### Work With Me

Check:

- your name is clearly the first thing the eye lands on
- `arcadeghosts.com/work-with-me` is easy to read
- service bullets do not feel dense
- the QR code does not dominate the whole back

### ArcadeGhosts

Check:

- `ArcadeGhosts` feels bold enough on the front
- the descriptor on the front is still readable
- the back copy feels invitational, not over-explaining
- the QR and URL have enough visual separation

## 8. Best First Batch Strategy

Keep the first order small.

Recommended approach:

1. order a small batch of `Work With Me`
2. order a small batch of `ArcadeGhosts`
3. compare them in hand under normal room light
4. scan the QR codes with your phone
5. decide what to change before any larger order

## 9. What To Notice Once They Arrive

Pay attention to:

- can you read them at arm's length?
- does the dark palette print richer or muddier than expected?
- do the cards feel too text-heavy or just right?
- which card would you actually hand to someone first?
- does the ArcadeGhosts card feel memorable?
- does the Work With Me card feel trustworthy?

## 10. If Something Feels Off

Most likely fixes:

- increase the main title size slightly
- reduce one block of text
- enlarge the QR code a little
- add more empty space around the copy
- lighten the text color slightly for contrast

## 11. Simplest Path

If you want the no-drama route:

1. run `npm run merch:cards -- --guides --pdf`
2. review the guide PNGs and guide PDFs
3. scan both QR codes manually
4. upload `Work With Me` clean PNGs to MOO first
5. upload `ArcadeGhosts` clean PNGs second
6. order a small test batch
7. review in hand before doing anything fancy
