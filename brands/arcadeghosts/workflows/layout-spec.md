# Layout Spec

This spec is meant to be literal enough that you can build both cards in a print layout tool or MOO without rethinking hierarchy every time.

## General Setup

Before starting:

1. use MOO's current standard business card template
2. confirm bleed and safe area in MOO before export
3. keep all important text and QR codes inside the safe area
4. use `logo.png` from `shared-assets/` in print editors unless WebP support is clearly fine

Suggested working frame names:

- `work-with-me-front`
- `work-with-me-back`
- `arcadeghosts-front`
- `arcadeghosts-back`

Suggested design approach:

- build the composition in a print layout tool
- export front and back separately
- upload to MOO last

## Shared Visual System

### Color Direction

- background: very dark charcoal or near-black
- accent 1: warm amber
- accent 2: restrained teal
- text: soft off-white, not pure white if possible

### Type Hierarchy

Use only 3 text levels max on each side:

- `Level 1`: primary name/title
- `Level 2`: supporting descriptor or URL
- `Level 3`: small labels, service bullets, or helper line

### Alignment

Use left alignment for all major text blocks.

Reason:

- clearer
- calmer
- easier to scan
- more premium than trying to center too much copy

### Spacing Rhythm

Use a simple spacing system:

- `8px` micro spacing
- `16px` small spacing
- `24px` medium spacing
- `32px` large spacing

If the layout tool forces you to eyeball it, keep the same rhythm visually even if the exact pixel values vary.

## 1. Work With Me Card

### Front

#### Layout

- align all text to left
- place the main text block in the left or center-left zone
- if using a logo mark, put it small in the upper-right or lower-right
- do not use a large full logo unless it clearly improves the composition

#### Suggested Structure

Top to bottom:

1. `Jason Pollard`
2. `Software Developer`
3. blank space
4. `Small projects. Clear problems.`
5. `Personal attention.`

#### Exact Hierarchy

- `Jason Pollard`
  - largest text on the card
  - bold or semibold
  - 1-2 lines max
- `Software Developer`
  - smaller than your name
  - use as a quiet descriptor
- tagline lines
  - medium size
  - can be stacked into two lines

#### Suggested Spacing

- top safe margin: `24-32px`
- name to title: `8-12px`
- title to tagline block: `20-28px`
- between tagline lines: `4-8px`

#### Alignment Notes

- keep the name, title, and tagline on one left edge
- resist the urge to spread text to all four corners
- leave some negative space

### Back

#### Layout

Use a two-zone layout:

- left/copy zone: URL, email, service bullets
- right or lower-right zone: QR code

#### Suggested Structure

Top to bottom in the copy zone:

1. `arcadeghosts.org/work-with-me`
2. `jason@arcadeghosts.org`
3. blank space
4. `Small software projects for:`
5. 4 bullets

QR code:

- right side, vertically centered
- or bottom-right if the layout feels tighter

#### Exact Hierarchy

- URL
  - strongest item on the back
- email
  - secondary
- section intro
  - smaller label
- bullets
  - smallest readable text

#### Suggested Spacing

- top safe margin: `24-32px`
- URL to email: `8-10px`
- email to section intro: `20-24px`
- intro to bullets: `8-12px`
- bullet line spacing: `6-8px`
- QR code separation from text block: `20-28px`

#### QR Code Size

Recommended starting size:

- around `96-120px` square in the working file

Do not make it tiny.

### Front / Back Pairing Rule

If the front is visually quiet:

- the back can carry a little more information

If the front is more graphic:

- keep the back even simpler

## 2. ArcadeGhosts Card

### Front

#### Layout

This side should feel more visual than the work card.

Two good options:

- `Option A`: logo or atmospheric art dominates, text is secondary
- `Option B`: text plus mood background, still restrained

Recommended:

- logo/art as focal point
- title block lower-left or center-left

#### Suggested Structure

1. `ArcadeGhosts`
2. optional sub-line:
   - `software, writing, music, cats,`
   - `and strange little experiments`

#### Exact Hierarchy

- `ArcadeGhosts`
  - biggest text on the card
  - should feel like a title, not body copy
- optional sub-line
  - smaller and quieter
  - do not let it dominate

#### Suggested Spacing

- top or bottom safe margin: `24-32px`
- title to sub-line: `10-14px`

#### Alignment Notes

- if the logo is visually strong, keep the text anchored in one corner
- if the front is mostly text, use more breathing room than the work card

### Back

#### Layout

This back should feel like a clean invitation.

Use a simple left-aligned text block plus QR code.

#### Suggested Structure

1. `arcadeghosts.org`
2. blank space
3. `A living portfolio for software,`
4. `writing, and strange little experiments.`
5. QR code

#### Exact Hierarchy

- URL
  - strongest element
- short descriptor
  - medium size
- QR code
  - clear, not crowded

#### Suggested Spacing

- top safe margin: `24-32px`
- URL to descriptor: `18-24px`
- descriptor to QR code: `24-32px`

#### QR Code Placement

Best options:

- bottom-right
- right-center

Avoid:

- placing it too close to the URL
- placing it so large it becomes the dominant visual

## Layout Build Instructions

### Work With Me Front

1. create the card-sized canvas
2. add dark background
3. place `Jason Pollard` top-left or center-left
4. place `Software Developer` directly beneath
5. add tagline block below with more space
6. optionally add a subtle logo mark in upper-right
7. export

### Work With Me Back

1. place URL first
2. place email under it
3. place service intro and bullet list
4. place QR code at right or lower-right
5. check safe margins
6. export

### ArcadeGhosts Front

1. place atmospheric background or logo treatment
2. anchor `ArcadeGhosts` in one strong location
3. add optional descriptor beneath
4. keep empty space visible
5. export

### ArcadeGhosts Back

1. place `arcadeghosts.org`
2. add short descriptor beneath
3. place QR code with breathing room
4. export

## Final Export Checklist

- [ ] front and back are separate files
- [ ] all text is inside safe area
- [ ] QR code is not too small
- [ ] URLs are proofread
- [ ] email is proofread
- [ ] exported files match MOO requirements
- [ ] order a small batch first
