# Merch And Cards

Reference: 2026-06-27 22:45 EDT

This document collects the current thinking about:

- `Work With Me` business cards
- personal `ArcadeGhosts` cards
- merch for yourself
- possible future merch to sell
- whether a merch page is worth hosting on the site later
- how to generate front/back card designs and merch images

The goal is to make this practical enough that you could order things without having to rediscover the plan later.

## Short Answer

- Business cards: yes, worth doing now.
- Personal `ArcadeGhosts` cards: also worth doing now.
- Merch for yourself: yes, start with a few test items first.
- Public merch store on the site: probably not worth building yet.
- Better first step for selling later: use a hosted merch platform first, then revisit a site merch page if there is real demand.

## Recommended Order

1. order `Work With Me` business cards
2. order `ArcadeGhosts` personal cards
3. order 1-2 personal merch test items
4. if you like the results, expand into a small merch set
5. only later consider a public merch store or merch page

## Current Brand Assets In This Repo

- Main visible site logo: `public/images/logo.webp`
- PNG version for reuse/export: `public/images/logo.png`
- Site logo component: `app/SiteLogo.tsx`
- Main `Work With Me` messaging: `app/work-with-me/page.tsx`

## Recommended Vendors

### Business Cards

Use `MOO` first.

Why:

- strong print quality
- easy premium-looking small runs
- good for cards where mood/design matters

Good starting product:

- `Original Business Cards`
- soft-touch or matte finish if available
- rounded corners only if the design clearly benefits

### Merch For You

Use `Printify` or `Fourthwall`.

Use `Printify` if:

- you mostly want to order a few items for yourself
- you want straightforward print-on-demand products
- you may want to experiment with mugs, shirts, stickers, or totes

Use `Fourthwall` if:

- you think you may eventually sell merch
- you want a hosted storefront first instead of building one into ArcadeGhosts

## Decision On A Merch Page

### For Now

Do not build a merch page into the site yet.

Why:

- you do not yet know which products you would actually want to keep
- you do not yet know if anyone besides you would want to buy them
- it adds upkeep and design work before the merch identity is proven

### Later

Worth adding a future merch page or TODO if one of these becomes true:

- people start asking where to buy mugs, shirts, or stickers
- you settle on 3-5 products that really fit the site identity
- the merch starts to feel like part of the world of the site rather than just novelty

## Immediate TODOs

- [ ] Export the current `ArcadeGhosts` logo in print-friendly sizes
- [ ] Generate a QR code for `https://arcadeghosts.com/work-with-me`
- [ ] Generate a QR code for `https://arcadeghosts.com`
- [ ] Create a first `Work With Me` card mockup
- [ ] Create a first `ArcadeGhosts` card mockup
- [ ] Order one small business card test batch
- [ ] Order one mug and one shirt for yourself
- [ ] Decide which art direction feels most “you” in print
- [ ] Revisit whether stickers or mugs should be the first public merch item later

## Current Local Merch Workspace

The most useful handoff files now live in the local `business-cards/` workspace:

- `business-cards/MOO-upload-checklist.md`
- `business-cards/layout-spec.md`
- `business-cards/layout-percentages.md`
- `for-me/printify-checklist.md`

Suggested order of use:

1. generate the card layouts from the business-card generator
2. export the card files
3. use the MOO checklist for the first print batch
4. use the Printify checklist for the personal merch sample order

## Card Strategy

You should probably have `two different cards`.

### 1. Work With Me Card

Purpose:

- side-hustle credibility
- local networking
- giving people a practical way to contact you for small software work

Tone:

- calm
- capable
- slightly distinctive
- not too weird

### 2. ArcadeGhosts Card

Purpose:

- personal/creative identity
- meetups, coffee shops, arcades, friends, interesting conversations
- sharing the site itself as a world, not just a services page

Tone:

- more expressive
- more atmospheric
- more obviously “ArcadeGhosts”

## Exact Business Card Recommendation

### Work With Me Card Front

Recommended copy:

```text
Jason Pollard
Software Developer

Small projects. Clear problems.
Personal attention.
```

Optional version:

```text
Jason Pollard
Software Developer

Web applications
AI workflow automation
Developer tooling
Technical problem solving
```

Design direction:

- dark background
- restrained use of amber/teal from the site
- optional subtle logo mark in one corner
- clean typography first, mood second

### Work With Me Card Back

Recommended copy:

```text
arcadeghosts.com/work-with-me

Small software projects for:
- websites and web apps
- automation and workflows
- AI-assisted systems
- internal tools and technical cleanup

QR code
```

Alternative shorter back:

```text
Need a useful technical fix,
workflow cleanup, AI integration,
or small internal tool?

arcadeghosts.com/work-with-me
jason@arcadeghosts.org

QR code
```

### Work With Me Card Layout Notes

- put your name large on the front
- put the URL and QR code on the back
- keep service bullets to 4 max
- do not overcrowd
- if the front already has a strong logo, keep the back simpler

## Exact Personal Card Recommendation

### ArcadeGhosts Card Front

Recommended copy:

```text
ArcadeGhosts
```

Optional sub-line:

```text
software, writing, music, cats,
and strange little experiments
```

Design direction:

- use the site logo or a cropped atmospheric logo treatment
- lean more into the neon diner / strange signal mood
- this card should feel like an invitation

### ArcadeGhosts Card Back

```text
arcadeghosts.com

Projects, writing, music, cats,
and late-night signal chasing.

QR code
```

Alternative version:

```text
ArcadeGhosts

Projects
Writing
Music
Cats
Games

arcadeghosts.com
QR code
```

### Personal Card Layout Notes

- front can be much more visual than the services card
- back should still be easy to scan quickly
- treat it like a tiny poster that also works as a link card

## Exact Next Steps For Ordering Business Cards

### Work With Me Card

1. Export `logo.webp` and `logo.png` into a print-ready folder.
2. Decide whether the logo appears prominently or only as a subtle mark.
3. Create a `front` image using the copy in this doc.
4. Create a `back` image with:
   - `arcadeghosts.com/work-with-me`
   - `jason@arcadeghosts.org`
   - 3-4 service bullets
   - QR code
5. Upload both sides to `MOO`.
6. Order a small test batch first.
7. Review in hand before ordering more.

### ArcadeGhosts Personal Card

1. Reuse the same base logo assets.
2. Create a more atmospheric `front` image.
3. Create a simpler `back` image with:
   - `arcadeghosts.com`
   - optional short descriptor
   - QR code
4. Upload both sides to `MOO`.
5. Order a small test batch first.
6. Compare side by side with the work card and refine.

## Exact Next Steps For Merch For You

Start with:

- one mug
- one t-shirt
- one sticker pack or single sticker

### Mug

Best use:

- easiest personal merch win
- very on-brand for the site mood

Design suggestions:

- site logo on one side
- short phrase on the other side
- or a small diner/arcade signal composition

Suggested phrases:

- `ArcadeGhosts`
- `Somewhere In The Pines`
- `Useful tools with a strange little heartbeat`
- `Strange little experiments`

### T-Shirt

Best use:

- more wearable if the design is subtle
- probably stronger as a left-chest plus back print than a huge front graphic

Design suggestions:

- small logo on chest
- larger atmospheric text or signal graphic on back
- avoid putting too much website copy on the shirt

### Stickers

Best use:

- easiest future public merch item
- cheap to test
- high personality

Design suggestions:

- logo sticker
- “Start Here” sticker
- neon signal booth sticker
- arcade token style sticker
- cat room sticker

## How To Generate The Card Front/Back Designs

You have three realistic options:

### Option A: Design Directly In The Printer Tool

Best for:

- fastest route
- lowest complexity

How:

1. Start a business card product in MOO.
2. Upload the logo.
3. Type the copy directly in their editor.
4. Position the QR code.
5. Export/order.

Tradeoff:

- fastest, but less custom

### Option B: Design In A Print-Ready Layout Tool

Best for:

- cleaner custom composition
- easy export for print

How:

1. Create a business card canvas at the printer’s dimensions.
2. Import:
   - `public/images/logo.png`
   - any supporting background art you create
3. Build the front and back separately.
4. Export as PNG or PDF for print.
5. Upload to MOO.

Tradeoff:

- best balance of control and ease

### Option C: Use AI To Generate Background Art, Then Compose Manually

Best for:

- strongest custom vibe
- more atmospheric merch

How:

1. Generate background art or concept art first.
2. Keep text and QR code placement manual.
3. Use the AI art as the visual layer only.
4. Export final assembled fronts/backs.

Tradeoff:

- best visually, but easiest to overdo

## How To Generate Merch Images

Use this workflow:

1. decide the product
2. decide the art direction
3. generate or export the artwork
4. place it into a mockup or merch tool
5. order one sample first

### Recommended Art Directions

#### Direction 1: Clean Logo

Best for:

- mugs
- stickers
- caps
- notebooks

Uses:

- current `ArcadeGhosts` logo
- dark background
- amber/teal accent lines

#### Direction 2: Neon Diner / Signal Mood

Best for:

- mugs
- posters
- shirts
- desk mats

Uses:

- atmospheric art inspired by the site
- not too busy
- maybe a phrase plus ambient scene

#### Direction 3: Category-Based Micro Collections

Best for:

- sticker packs
- postcards
- mini prints

Possible sets:

- `Arcade`
- `Cats`
- `Twin Peaks / Lodges`
- `Signal Booth`
- `Writing / Tiny Thoughts`

## Image Generation Prompts

These are starting prompts, not final prompts.

### Work With Me Card Background Prompt

```text
Create a subtle, premium business card background for a software developer.
Mood: calm, confident, slightly distinctive, not flashy.
Color palette: deep charcoal, warm amber accents, faint teal details.
Style: clean modern print design with a hint of neon atmosphere, lots of negative space, suitable for overlaid typography.
No logos, no text, no mockup, no hands.
Landscape composition for business card use.
```

### ArcadeGhosts Card Background Prompt

```text
Create an atmospheric business card background for a personal site called ArcadeGhosts.
Mood: neon diner at night, strange little experiments, arcade glow, mysterious but welcoming.
Color palette: dark navy, charcoal, amber, teal, soft neon red.
Style: cinematic, slightly retro, subtle surreal mood, elegant enough for print.
No logos, no text, no mockup, no people.
Landscape composition for business card use.
```

### Mug Art Prompt

```text
Create a simple, print-friendly mug graphic for ArcadeGhosts.
Mood: retro neon, cozy strange signal, readable at small size.
Use a dark background and limited colors.
Include visual motifs inspired by arcades, diner signs, night roads, or signal lights.
No mockup, no mug shape, no text unless requested separately.
Transparent or isolated composition preferred.
```

### Shirt Back Graphic Prompt

```text
Create a stylish back-print graphic for a shirt inspired by ArcadeGhosts.
Mood: retro arcade, strange signal, midnight diner, cinematic and wearable.
Avoid clutter and avoid giant poster-style complexity.
Design should read well from a few feet away.
No mockup, no people, no folded shirt.
```

## How To Generate The Final Files

### For Business Cards

- export front and back as high-resolution PNG or print PDF
- keep text manual, not baked into AI art unless you are sure the text is perfect
- verify margins and bleed inside the printer tool

### For Merch

- use transparent PNGs when the product design needs isolated art
- use full-bleed rectangular art when the product supports wraparound or all-over layout
- order 1 sample first before doing more

## Recommended “Merch For Me” First Order

Order these first:

- [ ] 1 `Work With Me` test card batch
- [ ] 1 `ArcadeGhosts` test card batch
- [ ] 1 black mug with logo or signal design
- [ ] 1 dark t-shirt with subtle front and stronger back print
- [ ] 1 small sticker set

This gives you:

- something practical
- something personal
- something wearable
- something fun

## Best Future Merch To Sell

If you ever sell publicly, start with:

- stickers
- mugs
- t-shirts
- tote bags

These are easiest to understand and most aligned with the site identity.

## Other Custom Merch Ideas

### For You Or Gifts

- mug
- t-shirt
- hoodie
- tote bag
- desk mat
- notebook
- postcard set
- mini print set
- hat
- enamel pin

### Most On-Brand Ideas

- retro motel keychain
- arcade token style coin or pin
- “Signal Booth” postcard or oracle card
- cat sticker mini-set
- Twin Peaks-adjacent strange signal art print
- tiny zine with favorite site fragments

## 15 Specific ArcadeGhosts Merch Concepts

1. `ArcadeGhosts` neon logo mug
2. left-chest logo shirt with a larger “strange little experiments” back print
3. sticker pack: arcade, diner, signal, woods, cat, cassette
4. diner coffee mug with `Somewhere In The Pines`
5. tote bag with logo and tiny hallway/room map motif
6. desk mat with moody neon landscape and small logo
7. “Start Here” postcard set
8. cat-room sticker sheet
9. “Useful tools with a strange little heartbeat” shirt
10. enamel pin shaped like an arcade token or signal light
11. mini zine with a few writings, thoughts, and screenshots
12. notebook with simple logo and dark cover treatment
13. art print inspired by the homepage atmosphere
14. `Signal Booth` mug or postcard
15. `Between Two Lodges` or `Lodges Within` themed mini print

## Suggested Personal Decision

If you only do one thing right now:

- order the two card types first

If you do two things:

- order the two card types
- order one mug

If you do three things:

- order the two card types
- order one mug
- order one shirt

## Future Site TODO

Potential future site item:

- add a low-pressure merch page later only after a few personal designs exist and at least one product feels genuinely worth sharing publicly
