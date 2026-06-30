# Apple Wallet Pass Setup

Reference: 2026-06-29 EDT

This doc covers the last-mile machine setup for turning the generated ArcadeGhosts networking pass into a real installable Apple Wallet pass.

Current device assumption for final install/proofing:

- iPhone 17

Use this with:

- [docs/networking-assets.md](docs/networking-assets.md)
- [generators/networking/README.md](../generators/networking/README.md)
- `npm run asset:wallet-pass`
- `npm run asset:wallet-pass:sign`

## What Brand Kit Already Does

Brand Kit already generates a sign-ready pass package:

- `pass.json`
- `manifest.json`
- Wallet image assets
- preview PNG
- unsigned `.pkpass.zip`

What Brand Kit cannot do by itself is Apple certificate provisioning.
That must come from your Apple Developer account.

## What You Need

- an Apple Developer account with Wallet pass permissions
- a Pass Type ID for this pass
- a Pass Type ID certificate
- the Apple Worldwide Developer Relations certificate
- a `.p12` export that includes the private key for your pass-signing certificate
- `openssl` available on your Mac

## Recommended Pass Type Identifier

For ArcadeGhosts, use something like:

```text
pass.com.arcadeghosts.networking
```

The exact identifier is your choice, but keep it stable once you start distributing passes.

## Apple Developer Setup

The Apple portal wording may shift slightly over time, but the flow should stay close to this:

1. Sign in to Apple Developer.
2. Open Certificates, Identifiers & Profiles.
3. Create a new Pass Type ID.
4. Use your chosen identifier, such as `pass.com.arcadeghosts.networking`.
5. Give it a clear display name, such as `ArcadeGhosts Networking Pass`.
6. Create a certificate signing request from Keychain Access on your Mac.
7. In Apple Developer, create a Pass Type ID certificate for that Pass Type ID.
8. Download the issued certificate.
9. Double-click it so it installs into Keychain Access.
10. In Keychain Access, find the installed certificate and confirm it includes a private key underneath it.
11. Export that certificate plus private key as a `.p12` file.
12. Choose and record the export password.
13. Download Apple’s current WWDR certificate and keep its local path handy.

## Create The Certificate Signing Request

On macOS:

1. Open Keychain Access.
2. Choose `Keychain Access -> Certificate Assistant -> Request a Certificate From a Certificate Authority...`
3. Enter your Apple Developer account email.
4. Enter a descriptive common name such as `ArcadeGhosts Wallet Pass`.
5. Choose `Saved to disk`.
6. Save the `.certSigningRequest` file somewhere stable.

That is the CSR you upload when Apple asks for it during certificate creation.

## Export The Pass Certificate As `.p12`

After Apple issues the Pass Type ID certificate and it is installed in Keychain Access:

1. Open Keychain Access.
2. Find the new pass-signing certificate.
3. Expand it and confirm a private key is nested below it.
4. Select the certificate and private key together if needed.
5. Export as `.p12`.
6. Save it somewhere local but private, for example under a personal secure certificates folder.
7. Record the password you used during export.

If the exported `.p12` does not include the private key, signing will fail.

## Suggested Local File Layout

One workable local setup is:

```text
~/certs/apple-wallet/
  arcadeghosts-wallet-pass.p12
  AppleWWDRCAG6.cer
```

Brand Kit does not require this exact location.
It just needs the paths.

## Generate The Sign-Ready Pass Package

Run:

```bash
npm run asset:wallet-pass
```

Expected outputs:

- `generators/outputs/networking/arcadeghosts-wallet-pass/`
- `generators/outputs/networking/arcadeghosts-wallet-pass-unsigned.pkpass.zip`
- `generators/outputs/networking/arcadeghosts-wallet-pass-preview.png`
- `generators/outputs/networking/arcadeghosts-wallet-pass-report.txt`

## Set The Required Environment Variables

On your Mac, set:

```bash
export APPLE_PASS_TYPE_IDENTIFIER="pass.com.arcadeghosts.networking"
export APPLE_TEAM_IDENTIFIER="YOURTEAMID"
export APPLE_WALLET_CERT_P12_PATH="$HOME/certs/apple-wallet/arcadeghosts-wallet-pass.p12"
export APPLE_WALLET_CERT_PASSWORD="your-p12-password"
export APPLE_WWDR_CERT_PATH="$HOME/certs/apple-wallet/AppleWWDRCAG6.cer"
```

Then sign the pass:

```bash
npm run asset:wallet-pass:sign
```

Expected output:

```text
generators/outputs/networking/arcadeghosts-wallet-pass.pkpass
```

You should also see a signing note text file next to it.

## Full Machine-Side Flow

From the repo root:

```bash
npm run asset:wallet-pass
export APPLE_PASS_TYPE_IDENTIFIER="pass.com.arcadeghosts.networking"
export APPLE_TEAM_IDENTIFIER="YOURTEAMID"
export APPLE_WALLET_CERT_P12_PATH="$HOME/certs/apple-wallet/arcadeghosts-wallet-pass.p12"
export APPLE_WALLET_CERT_PASSWORD="your-p12-password"
export APPLE_WWDR_CERT_PATH="$HOME/certs/apple-wallet/AppleWWDRCAG6.cer"
npm run asset:wallet-pass:sign
```

## Install On iPhone

Once `arcadeghosts-wallet-pass.pkpass` exists:

1. AirDrop it to your iPhone, or send it to yourself by Mail or Messages.
2. Open the file on iPhone.
3. Tap `Add` in Wallet.
4. Open Wallet and review the card face and details.
5. Scan the QR from another phone.
6. Confirm it opens exactly `https://arcadeghosts.org`.
7. Confirm it feels fast enough to reach and present on an iPhone 17 during a real conversation.

## Manual Proofing Checklist

- pass installs successfully in Apple Wallet
- top branding looks clean
- role line reads clearly
- website, email, GitHub, and LinkedIn fields render acceptably
- QR scans quickly from another phone
- QR still scans at medium screen brightness
- pass feels like an interesting software-person contact surface, not an ad
- conference card still feels simpler if the Wallet experience proves awkward

## Troubleshooting

If signing fails:

- confirm all five environment variables are set
- confirm the `.p12` path is correct
- confirm the WWDR certificate path is correct
- confirm the `.p12` password is correct
- confirm the Pass Type ID in Apple Developer matches `APPLE_PASS_TYPE_IDENTIFIER`
- confirm the certificate in Keychain had a private key before export
- rerun `npm run asset:wallet-pass` before `npm run asset:wallet-pass:sign`

If the pass signs but will not install:

- confirm the pass type identifier and team identifier are correct
- confirm the certificate was created for that exact Pass Type ID
- confirm the generated `.pkpass` includes `signature`, `manifest.json`, and `pass.json`

## Networking Positioning Reminder

The Wallet pass is optional.

For this networking flow:

- conference card = easiest fallback
- lock screen = fun ambient option
- Wallet pass = polished Apple-native option if the setup is worth it

Do not let Wallet setup block the meetup-ready PNG assets.
