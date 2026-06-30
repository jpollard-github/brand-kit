# Production Checklist

Reference: 2026-06-28 EDT

Use this checklist when deciding whether a collateral asset is truly `Production Ready`.

## Production Ready Checklist

- generator renders successfully
- manifest exists where appropriate
- verification passes
- human visual proof completed
- exported successfully
- source configuration documented
- intended usage documented
- tested in its real destination:
  email client, PDF viewer, print flow, browser surface, or other actual delivery context

## Maturity Reminder

This checklist works alongside the shared collateral maturity terminology:

- `Prototype`
- `Proof of Concept`
- `Production Candidate`
- `Production Ready`
- `Deprecated`

An asset should not be treated as `Production Ready` just because it looks finished. It should clear the operational checks above too.

## Capability Sheet Notes

For capability sheets specifically, also confirm:

- PDF opens cleanly
- PDF is one page or uses intentional page breaks
- text is readable at print size
- footer contact info is legible
- `Work With Me` URL is correct
- CTA hierarchy is correct
- no Stripe or discovery payment link appears in first-touch collateral
- no internal or meta copy appears in the rendered client-facing output
- service language matches the rest of the first-client collateral family
- complex-codebase or repo capability is present without overwhelming the business-workflow message
- output still fits one page

## Email Signature Notes

For email signatures specifically, also confirm:

- links are verified
- Outlook Web is proofed
- Outlook mobile is proofed
- at least one non-Outlook client is checked or explicitly deferred
- real sent-email rendering is confirmed
- reply and forward behavior is checked
- no Stripe or discovery payment link appears in first-touch use
- the generated HTML file is the one installed, not a manually rebuilt version

## Networking Asset Notes

For QR-driven networking assets specifically, also confirm:

- the raw QR image decodes to the expected URL
- the conference card QR decodes from another phone camera
- the lock-screen QR decodes after the image is transferred to the phone
- the lock-screen QR stays clear of top and bottom iOS UI
- the default QR target still matches the intended meetup/business context
- the asset feels like a useful personal networking surface, not a pushy sales surface

## Business Card Notes

For business cards specifically, use [docs/BUSINESS-CARD-PRODUCTION-CHECKLIST.md](docs/BUSINESS-CARD-PRODUCTION-CHECKLIST.md) and confirm:

- QR code scans cleanly on iPhone
- QR code scans cleanly on Android
- margins, bleed, and safe area are reviewed against the MOO template
- front and back variants are correct for the intended use
- final paper and finish choices are intentional
