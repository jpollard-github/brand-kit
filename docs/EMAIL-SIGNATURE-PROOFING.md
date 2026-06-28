# Email Signature Proofing

Reference: 2026-06-28 EDT

Use this checklist before treating the email signature as `Production Ready`.

## Goal

Confirm that the generated signature works in the actual email clients used for outreach, not just in the repo preview.

## Suggested Proof Pass

1. Generate the current signature:
   `npm run brand:email-signature`
2. Install the HTML-based signature into the email client you will actually use.
3. Send test messages to yourself.
4. Review those messages in the clients that matter most.

Recommended review surfaces:

- Gmail desktop web
- Outlook desktop or web
- Apple Mail
- iPhone Mail
- Gmail mobile app, if relevant

## What To Check

- name, role, website, and `Work With Me` CTA all appear
- links point to the expected destinations
- spacing does not collapse awkwardly
- the logo image renders instead of showing a broken placeholder
- dark mode does not make text unreadable
- the signature still feels like consulting communication, not promo art

## Decision Rule

- If the signature works in the real outreach client plus one or two common recipient surfaces, treat it as a strong `Production Candidate`.
- Only move it to `Production Ready` after real-client proof is complete and the review notes are boring.
