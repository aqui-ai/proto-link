# AGENTS.md — Operating Rules

Agent operating rules for this repository: **THL 3D Model Hosting (GitHub → Vercel)**.

## Purpose

A human (Mr. Lam) or an agent (Hermes) drops an AI-generated interactive 3D plant-model HTML file into this repo under `3d/<model-name>/index.html`. Vercel deploys it. The operator returns the public link `https://<project>.vercel.app/3d/<model-name>/`.

## Model file requirements

- Accept **single self-contained HTML** files (Three.js rendered in-browser, e.g. the Chifunde plant file).
- Keep the file as-is unless Olimpio explicitly asks for modification. **Do not inline CDN libs** unless directed — current convention keeps Three.js on public CDNs.
- Place each model in its **own folder**: `3d/<model-name>/index.html`. `<model-name>` is lower-case, hyphenated, readable (e.g. `chifunde-10tph`).
- Keep CDN dependencies unchanged on receipt.

## Deployment rule

- **Vercel auto-deploys on push.** Pushing a new/updated `3d/<name>/index.html` to the default branch triggers a deploy. Do not add a GitHub Actions build for the core flow — the Git integration already deploys.
- (Optional, not default) Only add an Actions index/gallery workflow if Olimpio asks for a single "all models" page.
- After pushing, wait a few seconds and return the public link. Provide the exact URL in the response.

## Auth & credentials

- **Single machine credential**: a GitHub personal-access token scoped to **this repo only**, stored encrypted (Hermes vault / CI secret), never committed.
- **No Vercel credential** is used by the pipeline — Vercel is connected via repo Git integration (set once during setup, not per-push).
- Never write tokens, ~/.netrc, or secrets into tracked files. Never echo a secret value into a response.
- If a secret is needed and not present, stop and ask — do not improvise or guess.

## Governance guardrails

- **IP ownership:** the repo must sit under a THL-owned namespace. If the GitHub identity is a personal account, flag it and route to a THL org/robot account before continuing.
- **Public footprint:** deployed models are public and indexable. This is acceptable only if it is Mr. Lam's explicit intent. If access should be restricted, gate the served path (e.g. Nginx `auth_basic`) rather than leaking the file; do not silently make a sensitive model world-readable without confirming.
- **No sensitive content:** do not put customer PII, financial records, contract contents, or credentials into this repo. Model HTML is engineering/visualization data.

## Hermes trigger

- A Hermes skill named **`plant-model-deploy`** owns this flow end to end: receives the HTML → commits to `3d/<name>/index.html` → pushes → returns the link.
- Trigger: user says *"host this 3D model"* with the file, or the file is auto-recognized as a 3D plant model.
- On ambiguity (folder name, repo target, access level), ask Olimpio once, then execute. Don't re-ask after an approval is given.

## Quality bar

- Verify the link returns HTTP 200 before declaring success. A successful push is not a successful deploy.
- If a deploy fails, report honestly with the error — never fabricate a "deployed" result.
- Keep README.md and this file in sync with any layout or auth changes.

## Status notes

- Repo not yet created; Vercel not yet connected; `plant-model-deploy` skill not yet built. Follow roadmap in README.
- Confirm repo ownership identity is THL-owned before cutting the token.