---
name: export-repo-review-zip
description: Create a complete timestamped BrandKit repository review archive, excluding Git-ignored content, write it under repo-reviews, and reveal the resulting zip in Finder. Use when the user asks to export, package, zip, or prepare this repository for review.
---

# Export repository review zip

1. Run `npm run repo:review-zip` from the repository root.
2. If Finder reveal is blocked by sandbox permissions, rerun the same command with the minimum required escalation.
3. Confirm that the command reports a zip named `brand-kit-repo-review-<UTC datetime>.zip` under `repo-reviews/`.
4. Report the exact clickable archive path and file count.

Use `scripts/create-repo-review-zip.mjs` as the only archive implementation. Do not hand-build a second archive or include files ignored by Git. Do not commit or push as part of this workflow.
