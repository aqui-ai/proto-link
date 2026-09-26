# prototype-link — GitHub → Cloudflare

Publish Mr. Lam's interactive 3D plant-model HTML files as shareable public links.
Repository: https://github.com/aqui-ai/proto-link (THL ownership confirmed by Olimpio).

## Publishing flow

Mr. Lam sends an HTML file to Hermes → Hermes saves it under
`public/<site>/<plant>/index.html` → commits and pushes to `main` →
Cloudflare Workers Builds deploys static assets → Hermes verifies and returns
`https://plants.qlt.co.mz/<site>/<plant>/`.

The Chifunde model's intended URL is:
**https://plants.qlt.co.mz/chifunde/plant1/**

Deployed on 2026-09-26. HTTPS returns HTTP 200 and the served HTML matches the
original byte-for-byte. Browser rendering and controls still need verification.
Workers Builds is not connected yet; this first deployment used local Wrangler.

## Repository layout

```text
public/
  chifunde/plant1/index.html   # Original model HTML, unchanged
  <site>/<plant>/index.html   # Each future model gets its own folder
wrangler.jsonc               # Static asset directory and custom domain
package.json                 # Pinned Wrangler and local commands
package-lock.json            # Reproducible deployment tooling
README.md
AGENTS.md
```

Only `public/` is served; `public` does not appear in the URL. Use lowercase,
readable, hyphenated site and plant names (e.g. `chifunde/plant1`). Updating a file
at the same path preserves its share link. No gallery is configured at `/`.

The browser renders Three.js. Preserve supplied HTML and its public CDN
dependencies exactly unless Olimpio asks for changes. No application server,
database, HTML compilation, or custom Worker script is needed.

## Local preview and validation

Use a Node.js version supported by Wrangler (Node 24 was used for setup).

```sh
npm ci
npm run check
npm run dev
```

Open `http://localhost:8787/chifunde/plant1/`. Check the rendering, camera controls,
layer buttons, and equipment selection. Missing paths should return 404.

## One-time Cloudflare setup

1. Push this repository to GitHub.
2. In the Cloudflare account containing the active `qlt.co.mz` zone, confirm the
   **Workers Free** plan. Do not upgrade or enable paid services without approval.
3. Under **Workers & Pages**, import `aqui-ai/proto-link` from GitHub as a Worker
   using Workers Builds. Authorize access to this repository.
4. Use these settings:
   - Worker name: `proto-link` (matches `wrangler.jsonc`).
   - Production branch: `main`.
   - Root directory: repository root.
   - Build command: empty (no compilation required).
   - Deploy command: `npm run deploy`.
   - Leave non-production branch builds disabled unless needed.
5. Workers Builds installs dependencies and uses its deployment token.
   The configuration declares `plants.qlt.co.mz` as a Custom Domain. The account
   and token must have access to that zone. Inspect any existing DNS record at
   that hostname before deployment; do not overwrite an unrelated service.
6. Cloudflare provisions the Custom Domain's DNS and HTTPS. Verify the exact
   model URL returns HTTP 200 and renders correctly before sharing it as live.

For an authenticated local deployment, `npm run deploy` uses the same config.
Verify the target account and Free plan first. A successful dry run or Git push
does not prove that the public deployment works.

## Credentials

- Mr. Lam uses his existing Hermes chat login.
- Hermes needs a GitHub machine credential scoped to this repository, kept in
  its encrypted vault. The current operator remote uses GitHub SSH; Hermes's
  repo-scoped token still needs provisioning.
- Cloudflare's GitHub integration and Workers Builds deployment token are set up
  once in Cloudflare. Hermes does not need a Cloudflare token for routine uploads.
- Never commit tokens, private keys, `.env`, `.dev.vars`, or `~/.netrc`.
- If authentication is missing, stop the affected remote operation and ask the
  operator to restore access. Do not put credentials in command arguments.

## Free-plan budget

Use Workers Static Assets on **Workers Free**. Static asset requests are free and
unlimited; Git-triggered deployment time consumes Workers Builds minutes even
though the HTML needs no compilation. Current documented Free limits:

- 3,000 build minutes per month; one concurrent build; 20-minute build timeout.
- 20,000 static files per deployment; 25 MiB per individual file.

These are platform limits, not a promise about future pricing. Confirm the account
plan during setup; do not enable paid plans or add-ons without Olimpio's approval.

References: [Build limits and pricing](https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/),
[Static asset limits](https://developers.cloudflare.com/workers/platform/limits/#static-assets).

## Governance and status

Olimpio confirmed THL ownership of `aqui-ai` and approved public, indexable models.
Model files must contain engineering/visualization data only: no customer PII,
financial records, contracts, or credentials.

- [x] Confirm THL repository ownership and public publication.
- [x] Initialize repository and push initial documentation.
- [x] Import the Chifunde HTML unchanged and prepare Cloudflare configuration.
- [x] Push the model and Cloudflare setup commits.
- [x] Confirm the Free-tier dashboard, deploy with Wrangler, and provision the custom domain.
- [ ] Connect Workers Builds to GitHub for automatic deployments from `main`.
- [ ] Verify the live Chifunde model end to end.
- [ ] Provision the repo-scoped Hermes credential and build `plant-model-deploy`.

Cloudflare integration and Wrangler now access the account containing `qlt.co.mz`.
Deployment version: `9fd810ac-994e-48ff-a40a-f0760278a4ab`.
The Free-tier dashboard was checked; the integration cannot read billing subscriptions.
No paid services were enabled. The Builds API reports no Git triggers for this Worker.
