# Unicornjump GitHub Pipeline Handoff

This document is the current handoff for deploying `unicornjump` through GitHub Actions and `fortress-phronesis`.

The old [DEPLOY_RUNBOOK.md](/Users/benjaminlagrone/Documents/projects/games/unicornjump/DEPLOY_RUNBOOK.md) describes the earlier model where Contabo built this repo directly from source. That is no longer the preferred release path.

## Current Deployment Model

`unicornjump` now uses a split pipeline:

1. The `unicornjump` repo builds and publishes the runtime image to GHCR.
2. A successful push-to-`main` build in `unicornjump` automatically dispatches the deploy workflow in `fortress-phronesis`.
3. The `fortress-phronesis` repo deploys that built image to Contabo.

Current runtime target:

- image: `ghcr.io/benlagrone/unicornjump-web`
- internal bind: `127.0.0.1:13081 -> 80`
- public URL: `https://sapphirelagrone.com/`
- fortress deploy compose: `docker-compose.unicornjump.yml`
- fortress app manifest: `deploy/apps/unicornjump.yaml`

## GitHub Workflows

### 1. Build workflow in `unicornjump`

Workflow file in GitHub:
- `.github/workflows/build-unicornjump.yml`

Behavior:

1. Triggers on push to `main` and manual dispatch.
2. Runs `npm ci --legacy-peer-deps` in `unicorn-jump/`.
3. Runs tests only if `src` contains `*.test.*` or `*.spec.*` files.
4. Runs `npm run build`.
5. Builds the container image locally in Actions.
6. Runs container smoke checks against:
   - `/`
   - `/asset-manifest.json`
7. Pushes:
   - `ghcr.io/benlagrone/unicornjump-web:sha-<commit>`
   - `ghcr.io/benlagrone/unicornjump-web:latest`
8. Uploads `build-metadata.json` as an artifact.
9. On successful pushes to `main`, dispatches the fortress deploy workflow automatically.

Important caveat:
- there are currently no real test files under `unicorn-jump/src`, so the active release gates are build plus container smoke, not a real test suite

### 2. Deploy workflow in `fortress-phronesis`

Workflow file:
- [`.github/workflows/deploy-unicornjump.yml`](/Users/benjaminlagrone/Documents/projects/pericopeai.com/fortress-phronesis/.github/workflows/deploy-unicornjump.yml)

Behavior:

1. Receives a `workflow_dispatch` call from `unicornjump` after a green `main` build.
2. Also remains runnable manually for rollback or redeploy.
3. Requires `source_sha`.
4. Resolves image tag `ghcr.io/benlagrone/unicornjump-web:sha-<source_sha>`.
5. SSHes to Contabo with a dedicated deploy key.
6. Uses a clean fortress checkout at:
   - `/root/workspace/fortress-phronesis-deploy`
7. Pulls the pinned image from GHCR.
8. Runs:
   - `docker compose -f docker-compose.unicornjump.yml pull unicornjump-web`
   - `docker compose -f docker-compose.unicornjump.yml up -d unicornjump-web`
9. Verifies:
   - `http://127.0.0.1:13081/`
   - `http://127.0.0.1:13081/asset-manifest.json`
   - `https://sapphirelagrone.com/`

## GitHub Secrets and Environment

The deploy workflow depends on the `prod` environment in `fortress-phronesis`.

Environment secrets currently expected there:

- `UNICORNJUMP_DEPLOY_HOST`
- `UNICORNJUMP_DEPLOY_USER`
- `UNICORNJUMP_DEPLOY_ROOT`
- `UNICORNJUMP_DEPLOY_SSH_KEY`
- `UNICORNJUMP_DEPLOY_KNOWN_HOSTS`
- `UNICORNJUMP_GHCR_READ_TOKEN`

Notes:

- the build workflow in `unicornjump` uses the built-in `GITHUB_TOKEN`
- Contabo pulls private GHCR images using the GHCR read token
- `unicornjump` also needs a repo secret:
  - `FORTRESS_WORKFLOW_TOKEN`
  - this token is used only to dispatch `deploy-unicornjump.yml` in `fortress-phronesis`

## Release Procedure

### Build and publish

1. Merge or push the desired release commit to `main` in `unicornjump`.
2. Wait for `Build Unicornjump Image` to pass in GitHub Actions.
3. Record the commit SHA used for the build.

### Deploy to production

Normal path:

1. Push the desired commit to `main`.
2. Wait for `Build Unicornjump Image` to pass.
3. The workflow auto-dispatches production deploy in `fortress-phronesis`.
4. Confirm the fortress deploy run passes all smoke checks.

Manual path:

1. Open `fortress-phronesis` Actions.
2. Run `Deploy Unicornjump`.
3. Set:
   - `environment=prod`
   - `source_sha=<full unicornjump commit sha>`
4. Confirm the workflow passes all smoke checks.

### Rollback

Rollback uses the same deploy workflow:

1. choose a previously known-good `source_sha`
2. rerun `Deploy Unicornjump` with that SHA

Because deployments are image-tagged by commit SHA, rollback is a redeploy of an older built artifact, not a rebuild on the server.

## Server Notes

Contabo state expected by the pipeline:

- host nginx proxies public traffic to `127.0.0.1:13081`
- Docker is available to the deploy user
- the deploy SSH public key is installed for the target user
- GHCR auth is available so the server can pull private images

Current fortress deploy root on the server:
- `/root/workspace/fortress-phronesis-deploy`

This separate checkout is intentional. The existing `/root/workspace/fortress-phronesis` tree had unrelated local changes, so the deploy workflow uses a clean path.

## What Is Still Missing

These are the main gaps before this becomes a stronger release pipeline:

1. add real frontend tests under `unicorn-jump/src`
2. add branch protection that requires the build workflow on `main`
3. decide whether rapid consecutive pushes should queue every deploy or skip older ones
4. replace the current cross-repo dispatch token with a narrower purpose-built token if you want tighter isolation

## Last Known Validation

The GitHub build pipeline was validated successfully on March 14, 2026 Central Time for commit:

- `dbbc1383d4d32dfc901f50b6ce9fc608229111b7`

That run produced a pullable GHCR image and Contabo authenticated successfully against GHCR.
