# Networking Assets

Reference: 2026-06-29 EDT

This doc covers meetup and networking-friendly digital assets for ArcadeGhosts.

For Apple Wallet setup and signing, also use [docs/APPLE-WALLET-PASS-SETUP.md](docs/APPLE-WALLET-PASS-SETUP.md).
For packet review, also use [docs/NETWORKING-REVIEW-CHECKLIST.md](docs/NETWORKING-REVIEW-CHECKLIST.md).

The goal is simple:

- show a polished, scannable asset from an iPhone
- point people to the general ArcadeGhosts site first
- feel like an interesting AI/software person, not a hard sell

Current device assumption for manual proofing:

- iPhone 17

## Commands

```bash
npm run asset:conference-card
npm run asset:lock-screen
npm run asset:wallet-pass
npm run asset:wallet-pass:sign
npm run asset:business-card
npm run asset:networking
npm run qr:verify
npm run review:packet
npm run review:packet:refresh
```

- `review:packet`
  package the current networking outputs for review without rerunning validation
- `review:packet:refresh`
  rerun tests, repo verification, networking generation, and then build the packet

## Current Default QR Target

- `https://arcadeghosts.org`

This is intentional for informal networking.

Use the general site first.
Do not default meetup assets to `/work-with-me` unless there is a deliberate reason.

## What Gets Generated

- conference card PNG and SVG
- conference card preview PNG and SVG
- lock screen PNG and SVG
- minimal lock screen PNG and SVG
- minimal installed-tuned lock screen PNG and SVG
- wallet pass package folder
- wallet pass unsigned `.pkpass.zip`
- wallet pass preview PNG
- wallet pass report TXT
- raw QR PNG
- QR verification report JSON and TXT
- lock-screen notes TXT
- `PHONE-IMPORT/` folder with iPhone-ready transfer files
- `PHONE-IMPORT/WALLPAPER-CYCLE/` convenience folder with the current wallpaper candidates only
- review packet

The networking review packet now also includes:

- `package.json`
- `package-lock.json`
- modified config files
- original logo source files
- captured command logs
- git diff context
- iOS lock-screen overlay review mocks
- networking review checklist

Business cards remain a separate existing generator family.

## iPhone 17 Notes

The current lock-screen review flow is tuned for Jason's iPhone 17 workflow.

- current lock-screen exports are calibrated against Jason's `1320x2868` iPhone 17 screenshot geometry
- use the generated lock-screen asset as the wallpaper proof target
- use the included iOS overlay review mocks as a pre-proof sanity check
- still do a final on-device crop and scan test after installing the wallpaper

If a future pass targets a different phone shape, update the overlay mocks and proofing notes rather than silently assuming the same crop.

## How To Test The QR Code

1. Open the generated image on a screen.
2. Use another phone's Camera app to scan it.
3. Confirm it opens exactly `https://arcadeghosts.org`.
4. Test both normal brightness and dimmer brightness.
5. Test from arm's length.
6. Test after transferring to iPhone 17 Photos.
7. Do not use any AI-generated QR code unless it is verified.

## How To Get The Assets Onto iPhone

Use any of these:

- AirDrop from Mac to iPhone
- iCloud Drive, then open from the Files app
- email the image to yourself and save it
- send it to yourself in Messages and save it
- open the file on iPhone and save it to Photos

## Friday Meetup Workflow

1. AirDrop the files from `generators/outputs/networking/PHONE-IMPORT/` to your iPhone 17.
2. Save the images to Photos if they do not land there automatically.
3. Favorite the conference card in Photos.
4. Set the installed-tuned minimal lock screen if you want the ambient QR option.
5. Test the QR from another phone.
6. At the meetup, open the conference card full-screen from Photos when someone asks what you do.

## Faster Wallpaper Iteration Cycle

Use this when you are tuning the lock screen and do not want to repeat the full folder-cleanup ritual every pass.

1. Regenerate only the wallpaper assets:
   `npm run asset:lock-screen`
2. AirDrop only the files in `generators/outputs/networking/PHONE-IMPORT/WALLPAPER-CYCLE/`.
3. Start with `2-arcadeghosts-lock-screen-minimal-installed-tuned.png`.
4. On iPhone, open that file from Files and tap `Share -> Save Image`.
5. Keep a small Photos album such as `Wallpaper Tests` and save each pass there.
6. Create the wallpaper from the latest saved photo in that album.
7. Take one screenshot after install and compare it against the previous pass.
8. Batch-delete old Files copies later instead of stopping each iteration to clean them up.

This keeps the cycle focused on one or two candidate files rather than the whole `PHONE-IMPORT/` bundle.

## How To Set The Lock Screen

1. Open Photos.
2. Select the generated lock screen PNG.
3. Tap Share.
4. Tap Use as Wallpaper.
5. Adjust crop if needed.
6. Tap Add.
7. Choose Set as Wallpaper Pair or Customize Home Screen.
8. On iPhone 17, double-check the final crop with the actual time/widgets layout you plan to use.

Current preferred minimal wallpaper candidate:

- `arcadeghosts-lock-screen-minimal-installed-tuned.png`
- fallback baseline: `arcadeghosts-lock-screen-minimal.png`

Treat the installed-tuned file as the default minimal lock-screen option unless a future device-proof pass shows a clear regression.

## How To Use The Conference Card

1. Save the conference card PNG to Photos.
2. Favorite it or put it in a dedicated album.
3. At the meetup, open it full-screen.
4. Let someone scan the QR with their camera.
5. Use it like a digital business card.

## Wallet Pass Flow

The Wallet pass is the polished follow-on to the PNG networking assets.

Use it when:

- you want a cleaner Apple-native contact surface
- you already know the QR and card copy are working
- you are willing to handle Apple pass-signing setup

Use the PNG conference card first when:

- you need something immediately
- you have not finished Apple certificate setup
- you want the easiest review and transfer path

Generate the sign-ready package:

```bash
npm run asset:wallet-pass
```

If you have the Apple signing credentials, create the real installable pass:

```bash
npm run asset:wallet-pass:sign
```

The generated pass is intentionally still driven by the same networking config:

- brand-owned role line
- brand-owned tagline
- brand-owned website and social links
- QR target that defaults to `https://arcadeghosts.org`

For exact certificate setup and local signing steps, see [docs/APPLE-WALLET-PASS-SETUP.md](docs/APPLE-WALLET-PASS-SETUP.md).

## How To Add The Pass To iPhone

After signing produces a real `.pkpass` file:

1. AirDrop it to the iPhone, or send it to yourself through Messages or Mail.
2. Open the `.pkpass` file on the iPhone.
3. Tap Add to Apple Wallet.
4. Open Wallet and confirm the pass renders correctly.
5. Scan the QR from the pass on another phone and confirm it opens exactly `https://arcadeghosts.org`.

If you only have the unsigned package, review the preview PNG and package contents, but do not treat it as installable yet.

## Business Card Support

Printed cards are still handled by the existing business-card workflow.

Use:

```bash
npm run asset:business-card
npm run brand:verify:business-cards
```

That keeps the print-ready PNG/PDF flow and QR verification path consistent.

## Networking Flow

The networking flow is meant to be low-friction and phone-first:

1. Show the conference card from Photos, or the lock screen from the phone itself.
2. Let the other person scan the QR and land on the brand home page.
3. Let interest move naturally from site visit to conversation.
4. Share deeper links like `Work With Me` only when they fit the conversation.

This matters for more than one person.

It is useful for:

- anyone attending informal meetups before printed cards arrive
- anyone who wants a softer public entry point than a direct services pitch
- any future brand in this repo that needs a scannable phone-display asset
- event or conference situations where physical cards are awkward, depleted, or secondary

It is not the highest-priority collateral family for every brand.
For most consulting outreach, email signature, business cards, and capability sheet still matter more.
But the networking flow is a strong reusable fallback for real-world events, introductions, and fast digital handoffs.

## Current Networking TODOs

The canonical TODO list for this workstream lives in [TODO.md](TODO.md) under `Priority 1: First Client Collateral`.

Current networking-specific open items are:

- manually proof the conference card and lock screen on iPhone
- sign and test the Wallet pass if Apple credentials are available
- compare Wallet pass convenience against the conference card at a real meetup
- decide whether the networking family stays useful after real event use
- keep the conference card as the default low-friction fallback even if the Wallet pass works well
