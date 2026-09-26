# AGENTS.md — Operating Rules

Agent operating rules for **THL 3D Model Hosting (GitHub → Cloudflare)**.

## Purpose and layout

Publish supplied plant-model HTML at `public/<site>/<plant>/index.html` and return
`https://plants.qlt.co.mz/<site>/<plant>/` after verifying deployment.
The first model is `public/chifunde/plant1/index.html`.

- Preserve the supplied HTML byte-for-byte unless Olimpio explicitly requests edits.
- Keep Three.js and other CDN dependencies unchanged; do not inline libraries.
- Use lowercase, readable, hyphenated site and plant names.
- Only `public/` is served. Never place credentials or internal documents there.
- Do not add a gallery unless Olimpio requests one.

## Deployment

- Hosting is Cloudflare Workers Static Assets; `wrangler.jsonc` is the source of truth.
- Workers Builds should deploy on pushes to `main` once the Git integration is connected.
- Use the pinned local Wrangler via `npm run dev`, `npm run check`, and `npm run deploy`.
- No HTML compilation, custom Worker handler, or GitHub Actions pipeline is needed.
- Keep the Worker name `proto-link` consistent with the dashboard.
- Target the account containing `qlt.co.mz`; verify account access and inspect
  existing `plants.qlt.co.mz` DNS before provisioning its Custom Domain.
- Use **Workers Free**. Do not upgrade plans or enable paid services without approval.
- Verify HTTP 200 at the exact model URL and check browser rendering and controls.
  Do not equate a successful commit, push, or dry run with a successful deployment.
- Report authentication or deployment failures honestly and give the exact live URL
  only with a clear statement of its verification status.

## Auth and ownership

- Repository: `aqui-ai/proto-link`. Olimpio confirmed this namespace is THL-owned.
- Public, indexable publication of the plant models is approved.
- Hermes's routine uploads use one repo-scoped GitHub machine credential, encrypted
  in its vault. The operator currently uses an SSH remote.
- Cloudflare Git integration and the Workers Builds deployment token are configured
  once in Cloudflare; routine Hermes uploads do not need a Cloudflare credential.
- Never commit or print tokens, private keys, `~/.netrc`, or secrets.
- If required authentication is missing, ask the operator to restore it rather
  than guessing credentials or changing the auth model silently.
- Do not publish customer PII, financial records, contracts, or credentials.

## Hermes trigger

The planned `plant-model-deploy` skill receives HTML, places it under
`public/<site>/<plant>/index.html`, commits, pushes, verifies deployment, and returns
the URL. Trigger: "host this 3D model" with an HTML file, or a recognized plant model.
Ask Olimpio once if the site, plant name, target, or access level is ambiguous;
do not repeat approvals already given.

## Current status

Initial documentation is on GitHub. The model and Cloudflare configuration are
prepared locally; pushing is blocked by GitHub SSH authentication. The connected
Cloudflare API returned an authentication error, so Workers Free, the zone,
Git integration, and live deployment remain unverified. The Hermes skill and its
repo-scoped credential are not yet provisioned. Follow the setup steps in README.md.

Keep README.md and this file synchronized with layout, authentication, and status changes.
