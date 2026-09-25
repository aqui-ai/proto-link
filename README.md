# 3D Model Hosting — GitHub → Vercel

Turn Mr. Lam's AI-generated interactive 3D plant-model HTML files into public share links — automatically, repeatably, with no server to operate.

## Business problem

Mr. Lam produces interactive 3D plant models with AI (single self-contained HTML files, e.g. *Chifunde 10 t/h gold processing plant*). He needs a **zero-friction way to turn any such file into a shareable public link** — his action is *"paste the file into Hermes, get back a link."* The same path must work for every future model.

## Solution in one line

Mr. Lam sends the HTML to Hermes → Hermes commits it to this repo under `3d/<model>/index.html` → Vercel auto-deploys on push → Hermes returns `https://<project>.vercel.app/3d/<model>/`.

## How it works

```
1. Mr. Lam sends the HTML file to his Hermes chat  (authenticates as HIMSELF)
2. Hermes commits + pushes to this GitHub repo      (HERMES's machine credential, scoped to this repo only)
3. Vercel auto-deploys from the repo                (no credential — Vercel watches the repo)
4. Hermes returns the ready-to-share link
```

### Auth model (two locks, two identities)

| Step | Identity | Credential |
|---|---|---|
| Mr. Lam sends file to Hermes | Mr. Lam (personal chat login) | Unchanged — his normal login, Discord/Hermes |
| Hermes pushes to GitHub | Hermes (machine identity) | GitHub personal-access token, scoped to **this repo only**, stored encrypted in Hermes' vault |
| Vercel deploys | none | Vercel Git integration watches the repo — no Vercel token needed |

**Key property:** Hermes needs exactly **one** credential — a narrowly-scoped GitHub token. No Vercel token, no Vercel login. The GitHub→Vercel integration is what removes the second credential.

### Security hygiene for the GitHub token

- **Scope:** write access to this one repo only. Nothing else in the account, no delete-account power.
- **Rotation:** minted as a machine identity, not a human password. If leaked, revoke and reissue in minutes; survives any employee departure.
- **Storage:** encrypted in the Hermes secret store. Never committed to the repo, never in a script.

## Repository layout

```
3d/<model-name>/index.html   <- each model lives in its own folder under 3d/
README.md                    <- this file
AGENTS.md                    <- instructions for AI agents working in this repo
```

Each future model = a new folder under `3d/`. Vercel serves everything in the repo; the URL mirrors the path.

### URL convention

- Single model: `https://<project>.vercel.app/3d/<model-name>/`
- (Optional, if Actions gallery is added) index of all models: `https://<project>.vercel.app/`

## Dependencies

- **Three.js** loaded from public CDNs (cdnjs + jsdelivr) inside the model HTML — as chosen, not inlined. Browser does all 3D rendering; no app server.
- **44 or later note:** model files are static; no build step needed for the core flow.

## Governance note

- Repo must live under a **THL-owned namespace** (org/robot account), not a personal GitHub account, so company IP stays company IP. Confirm `rnrnshn` is a THL/company identity or use a dedicated THL org account before cutting the token.
- Public deployment makes the model **indexable by search engines** — a permanent public footprint. Acceptable only if that is Mr. Lam's explicit intent. If not, gate the served path later (e.g. password-protect the folder) without redoing the pipeline.

## Roadmap / status

- [ ] Confirm repo ownership (THL org vs personal) and mint scoped GitHub token
- [ ] Create public GitHub repo with this layout
- [ ] Connect repo to Vercel (Git integration) — first deploy
- [ ] Build `plant-model-deploy` Hermes skill: commit + push + return link
- [ ] Validate end-to-end with the Chifunde file
- [ ] (Optional) GitHub Actions index/gallery page

## Key files

- `README.md` — project overview and usage
- `AGENTS.md` — agent operating rules for this repo