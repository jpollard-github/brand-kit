# Networking Asset Generator

Use this generator for meetup and networking-friendly digital assets that can be shown from a phone and scanned with a camera.

## Commands

```bash
npm run asset:conference-card
npm run asset:lock-screen
npm run asset:wallet-pass
npm run asset:wallet-pass:sign
npm run asset:networking
npm run qr:verify
npm run review:packet
npm run review:packet:refresh
```

- `review:packet`
  package the current networking outputs into a review packet without rerunning validation
- `review:packet:refresh`
  rerun tests, verification, and networking generation before packaging

## Outputs

Generated outputs are written under:

- `generators/outputs/networking/`

Typical outputs include:

- raw QR PNG
- conference card PNG and SVG
- conference card preview PNG and SVG
- lock screen PNG and SVG
- minimal lock screen PNG and SVG
- minimal installed-tuned lock screen PNG and SVG
- wallet pass package folder
- wallet pass unsigned `.pkpass.zip`
- wallet pass preview PNG
- wallet pass signing report
- QR verification report JSON and TXT
- lock screen notes TXT
- `PHONE-IMPORT/` convenience bundle
- `PHONE-IMPORT/WALLPAPER-CYCLE/` one-step wallpaper iteration bundle

## QR Behavior

- The default QR target is the brand home URL:
  `https://arcadeghosts.org`
- Override it with:
  `--qr-target https://example.com`
- QR generation is source-generated, not AI-generated.
- QR verification is programmatic and the generator fails if verification does not match the expected URL.

## Wallpaper Iteration

When tuning only the phone wallpaper, prefer:

```bash
npm run asset:lock-screen
```

Then AirDrop just the files under:

```text
generators/outputs/networking/PHONE-IMPORT/WALLPAPER-CYCLE/
```

That folder is meant to reduce friction during repeated on-device wallpaper proofing.

Current preferred minimal wallpaper candidate:

- `2-arcadeghosts-lock-screen-minimal-installed-tuned.png`

Keep the plain minimal variant as a fallback comparison, but treat the installed-tuned file as the default option for current iPhone proofing.

## Business Card Support

The meetup asset family does not replace the existing business-card workflow.

Use:

```bash
npm run asset:business-card
```

That aliases the existing order-ready business-card generation path.

## Wallet Pass Support

Brand Kit can now generate a sign-ready Apple Wallet pass package for networking use.

Use:

```bash
npm run asset:wallet-pass
```

That creates:

- a pass package folder with `pass.json`, `manifest.json`, and Wallet image assets
- an unsigned `.pkpass.zip` package for inspection
- a preview PNG
- a text report with the QR target and output paths

If you already have Apple Wallet pass-signing credentials, you can create a real installable `.pkpass`:

```bash
npm run asset:wallet-pass:sign
```

Required environment variables:

- `APPLE_PASS_TYPE_IDENTIFIER`
- `APPLE_TEAM_IDENTIFIER`
- `APPLE_WALLET_CERT_P12_PATH`
- `APPLE_WALLET_CERT_PASSWORD`
- `APPLE_WWDR_CERT_PATH`

Without those credentials, the pass remains sign-ready but not installable in Apple Wallet.

For the full Apple certificate and signing flow, see:

- [docs/APPLE-WALLET-PASS-SETUP.md](../../docs/APPLE-WALLET-PASS-SETUP.md)
