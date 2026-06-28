# Email Signature Generator

Use this generator for a rendered email-signature preview plus HTML source.

This asset should feel like real outbound consulting communication, not merch or decorative promo art.

## Command

```bash
npm run brand:email-signature
```

## Outputs

- `generators/outputs/email/arcadeghosts-email-signature.html`
- `generators/outputs/email/arcadeghosts-email-signature.png`
- `generators/outputs/email/arcadeghosts-email-signature.manifest.json`

## What To Use

- HTML source for adapting into an actual email client signature:
  `arcadeghosts-email-signature.html`
- PNG preview for review and approval:
  `arcadeghosts-email-signature.png`
- Manifest for preflight/reference:
  `arcadeghosts-email-signature.manifest.json`

The HTML output is the one to adapt into an email client.
The PNG is only for review/proofing.

## First Real Use

- Install the HTML-based signature into the email client you will actually use for outreach.
- Send test emails to yourself before calling it done:
  desktop, mobile, Gmail, Outlook, and Apple Mail where practical.
- Verify link targets, spacing, image rendering, and dark-mode behavior.
- Keep this as a consulting touchpoint, not a decorative brand artifact.

## Recommended Variants

Proof the default signature first and treat it as the primary daily outreach signature.

Recommended usage order:

1. `default`
   primary daily outreach signature
2. `synthwave`
   strongest ArcadeGhosts personality, optional special-use variant after default is proven
3. `conference`
   events and networking
4. `minimal-print`
   plainest fallback option
5. `winter` / `holiday`
   seasonal only

Themes should mostly change visual treatment, not core business messaging.

## Proofing Status

- Local generation and manifest/preflight checks are covered in-repo.
- Real email-client proof is still a manual step before this should be treated as `Production Ready`.
- Use [docs/EMAIL-SIGNATURE-PROOFING.md](../../docs/EMAIL-SIGNATURE-PROOFING.md) as the manual review checklist.
- Use the generated HTML file directly in Outlook web rather than manually rebuilding the signature.

## CTA Model

- The signature uses the logical primary CTA from client-collateral config.
- In the current ArcadeGhosts implementation, that resolves to `Work With Me`.
- First-touch signatures should keep `Work With Me` as the primary CTA.
- Do not add Stripe or discovery payment links to first-touch signatures.
- Reusable generator logic should keep consuming CTA intent and brand metadata rather than hardcoding deployment-specific funnel URLs.

## Verification

```bash
npm run brand:verify:email
```

This checks that the email-signature manifest exists and that its HTML/PNG outputs, rendered PNG dimensions, required contact fields, website URL, and `Work With Me` URL still match expectations.
