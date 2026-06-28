# Integrations

Use this folder for local machine integration setup that should not be hardcoded into the shared repo.

## Website Handoff Config

Tracked example:

- `integrations/website-handoff.example.json`

Local machine override:

- `integrations/website-handoff.local.json`

The local file is gitignored and is the place to store machine-specific paths such as:

- the local website repo path
- the intended destination paths for generated brand assets

If the local config is missing, the website handoff command should stage assets inside this repo and tell you what configuration is still needed before copying anything into another repo.
