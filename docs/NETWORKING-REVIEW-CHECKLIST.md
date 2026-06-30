# Networking Review Checklist

Reference: 2026-06-29 EDT

Use this checklist when reviewing the ArcadeGhosts networking packet in ChatGPT or by hand.

This is especially tuned for Jason's current device workflow:

- iPhone 17
- phone-first meetup use
- QR scan from another person's phone
- general site as the first destination

## Review Order

1. Conference card
2. Lock screen
3. Minimal lock screen
4. Lock-screen iOS overlay mocks
5. Wallet pass preview
6. Raw QR and QR verification report
7. Command logs and git diff context

## Conference Card

- name is easy to read at arm's length
- role line feels interesting and credible
- `arcadeghosts.org` is clear
- QR is large enough to scan from another phone
- layout feels like a software person first, not a pitch deck
- nothing important is too close to the edges

## Lock Screen

- still looks good as a wallpaper, not just an ad
- time/date area stays visually safe
- widget area does not collide with the QR
- bottom affordance area does not collide with the QR
- QR remains comfortably scannable on an iPhone 17-sized lock screen
- crop still works after actual wallpaper install

## Minimal Lock Screen

- feels more like wallpaper and less like a promotional card
- still keeps the logo and `arcadeghosts.org` visible
- QR is still comfortably scannable
- the design stays clear of iPhone 17 top and bottom UI areas
- it is a plausible fallback if the default lock screen feels too salesy

## Overlay Mocks

- widget overlay version still leaves the QR readable
- minimal overlay version still feels balanced
- top time area does not visually crush the logo or key text
- bottom controls do not crowd the QR

These overlays are review aids, not literal iOS screenshots.

## Wallet Pass Preview

- pass branding looks coherent with the rest of the system
- role line is concise enough
- website and contact surfaces make sense
- Wallet pass still feels optional rather than mandatory
- conference card would still be easier if the Wallet flow proves awkward

## QR / Verification

- QR target is `https://arcadeghosts.org`
- verification logs show a pass
- conference card QR passes
- lock screen QR passes
- no accidental `work-with-me` first-touch link appears in the networking assets

## Final Human Questions

- If you met Jason at a casual AI meetup, would the conference card feel polished and memorable?
- Would the lock screen feel clever without being awkward?
- Does the Wallet pass seem worth the extra setup, or is the conference card enough?
- Is anything too salesy for a low-pressure networking context?
