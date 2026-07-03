# Manual Instructions

Reference: 2026-06-30 EDT

This doc turns the highest-value manual TODO items into concrete checklists.

Use this when you want to move the repo forward without re-reading the whole roadmap in [TODO.md](../TODO.md).

Status reminder:

- These checklists primarily move assets from `Production Candidate` toward `Production Ready`.
- Manual proofing is separate from implementation completion and separate from code validation.
- Physical proofing still applies where the asset has a printed or tangible form factor.
- `Field Validated` is later and requires real-world use, not just repo review.

## Recommended Order

1. Capability sheet proofing
2. Email signature proofing
3. Business-card production verification
4. Networking proofing
5. Wallet pass proofing, only if Apple signing credentials are available

Current funnel priority:

1. Capability sheet as the primary warm-lead leave-behind
2. Email signature and Work-With-Me business card as first-touch support assets
3. Discovery-call and proposal surfaces only after the P0 assets are in good shape

## 1. Email Signature Proofing

Goal:
Confirm the current signature works in real mail clients, not just in the repo preview.

Prep:

1. Regenerate the current signature:
   `npm run brand:email-signature`
2. Locate the generated files in:
   `generators/outputs/email/`
3. Use the HTML file, not the PNG, as the install source.

What to install:

1. Open:
   `generators/outputs/email/arcadeghosts-email-signature.html`
2. Copy the rendered signature content into your actual mail client signature settings.
3. If Outlook Web is your main sender, install it there first.

Proof pass:

1. Send yourself a test email from your real outreach account.
2. Review that message in Outlook Web or Outlook desktop.
3. Review the same message in Outlook mobile.
4. Review the same message in at least one non-Outlook surface:
   iPhone Mail, Apple Mail, Gmail web, or Gmail mobile.
5. Reply to the message and confirm the signature still behaves reasonably.
6. Forward the message and confirm the signature still behaves reasonably.
7. If dark mode is common in the client you use, check it there too.

What to check:

1. Name, role, website, and `Work With Me` CTA all appear.
2. Text is comfortably readable on phone without pinch-zoom.
3. Links go to the right places.
4. The logo renders correctly.
5. Spacing does not collapse awkwardly.
6. The signature still feels like consulting communication, not promo art.

When to mark progress in TODO:

1. If Outlook mobile, one non-Outlook client, reply behavior, forward behavior, and real sent-email rendering all look good, you can treat the manual-proofing TODO item as complete and promote the asset to `Production Ready` if no separate physical proofing remains.

## 2. Capability Sheet Proofing

Goal:
Confirm the capability sheet is readable, credible, and ready for real warm-lead follow-up.

Prep:

1. Regenerate the capability sheet:
   `npm run brand:capability-sheet`
2. Open the generated PDF or preview output in:
   `generators/outputs/client-collateral/`
3. Also keep [PRODUCTION-CHECKLIST.md](./PRODUCTION-CHECKLIST.md) open.

Proof pass:

1. Open the PDF on your Mac at normal zoom.
2. Open the PDF at a zoom level that feels closer to how a recipient would actually read it.
3. If possible, view it on a phone too.
4. If you plan to email it, attach it to a draft email and preview it from there.

What to check:

1. The sheet fits on one page.
2. The main headline and service framing are immediately understandable.
3. The CTA is clear and points to the right place.
4. Footer contact info is legible.
5. No internal/meta language appears in the client-facing output.
6. Service language matches the rest of the first-client collateral family.
7. It still feels like something you would actually send to a prospect.

Good decision question:

1. If someone asked “what do you do?” and you emailed this PDF right now, would it help or create friction?

When to mark progress in TODO:

1. If readability, CTA clarity, footer legibility, and one-page fit all feel solid in a real review pass, you can close the capability-sheet manual-proofing items and promote the asset to `Production Ready`.

## 3. Networking Proofing

Goal:
Confirm the conference card and current preferred minimal lock screen work on the real phone.

Prep:

1. Regenerate networking assets:
   `npm run asset:networking`
2. Use the files under:
   `generators/outputs/networking/PHONE-IMPORT/`
3. For wallpaper testing, use:
   `generators/outputs/networking/PHONE-IMPORT/WALLPAPER-CYCLE/`

Conference card proof pass:

1. AirDrop `arcadeghosts-conference-card.png` to your iPhone.
2. Save it to Photos.
3. Open it full-screen in Photos.
4. Use another phone to scan it.
5. Test at normal brightness.
6. Test again at dimmer brightness.
7. Decide whether it feels polished and easy to use in a real conversation.

Lock-screen proof pass:

1. AirDrop:
   `2-arcadeghosts-lock-screen-minimal-installed-tuned.png`
2. Save it to Photos.
3. Open it in Photos.
4. Tap `Share -> Use as Wallpaper`.
5. Set it as the lock screen.
6. Take one screenshot after install.
7. Use another phone to scan the QR from the lock screen.
8. Confirm the QR is clear of the top time area and bottom controls.

Decision questions:

1. Does the conference card feel easier than the lock screen?
2. Is the lock screen clever without being awkward?
3. Does the lock screen still feel like a wallpaper, not just an ad?

When to mark progress in TODO:

1. If the conference card scans comfortably and the lock screen looks good after install and still scans, close the networking proof items.

## 4. Business-Card Production Verification

Goal:
Finish the remaining real-world checks around the printed-card workflow.

Prep:

1. Open [BUSINESS-CARD-PRODUCTION-CHECKLIST.md](./BUSINESS-CARD-PRODUCTION-CHECKLIST.md).
2. Make sure the latest order-ready assets have been generated.

Manual check pass:

1. Confirm the final URL and email values again.
2. Confirm the correct front/back pairings.
3. Confirm the upload files are the clean no-guide files.
4. Test QR scan speed on iPhone.
5. Test QR scan speed on Android if you can.
6. Review margins, bleed, trim, and safe area against the MOO template.
7. Confirm paper/finish choices.
8. When the physical cards arrive, do one real printed sanity check before declaring victory.

When to mark progress in TODO:

1. Close this only after the real manual and physical checks are done, not just after exports succeed.

## 5. Wallet Pass Proofing

Only do this if Apple Wallet signing credentials are available.

Goal:
Decide whether the Wallet pass is actually better than the conference card.

Prep:

1. Generate the sign-ready pass:
   `npm run asset:wallet-pass`
2. If credentials are available, sign it:
   `npm run asset:wallet-pass:sign`

Proof pass:

1. AirDrop the signed `.pkpass` file to the iPhone.
2. Add it to Apple Wallet.
3. Open the pass and inspect the layout.
4. Scan the QR from another phone.
5. Compare how awkward or smooth it feels relative to the conference card.

Decision question:

1. If you were at a casual meetup tonight, would you actually use the Wallet pass instead of the conference card?

## Quick “What Should I Do Next?”

If you only want the shortest answer:

1. Finish capability-sheet proofing.
2. Finish email-signature proofing.
3. Finish business-card production verification.
