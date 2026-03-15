# Deployment Runbook (Current Path: Git + Docker Build on Contabo)

This runbook defines the intended production deployment path for this repo on the
Contabo VPS behind `sapphirelagrone.com`.

The model mirrors the PericopeAI frontend deployments:
- source pulled from Git
- deploy by pinned commit SHA, not branch tip
- build locally on the target host with Docker
- serve the static frontend from an internal `nginx` container
- terminate TLS and route public traffic with host `nginx`

This repo does not currently publish versioned runtime images to a registry.
Production deploys should therefore build from source on the VPS.

## 1) Deployment Shape

Target production layout:
- Repo path on server: `/root/workspace/unicornjump`
- App path in repo: `/root/workspace/unicornjump/unicorn-jump`
- Container service: `unicornjump-web`
- Internal bind: `127.0.0.1:13081 -> container:80`
- Public domain: `https://sapphirelagrone.com`
- Optional redirect: `https://www.sapphirelagrone.com -> https://sapphirelagrone.com`

Traffic flow:
1. public request hits host `nginx`
2. host `nginx` terminates TLS
3. host `nginx` proxies to `127.0.0.1:13081`
4. container `nginx` serves the built React app

## 2) Repo Deployment Artifacts

This repo now uses these deployment artifacts:
- `docker-compose.yml` at repo root
- `unicorn-jump/Dockerfile`
- `unicorn-jump/nginx/default.conf`

Behavior of those files:
- build the React app from `unicorn-jump/`
- install dependencies in Docker with `npm ci --legacy-peer-deps` because the
  current CRA 3 toolchain does not cleanly resolve with strict modern npm peer handling
- serve the CRA build output from `nginx`
- use SPA fallback (`try_files ... /index.html`)
- keep the app container internal-only via loopback host binding

## 3) One-Time Host Prereqs

Install and verify:
- `git`
- `docker`
- Docker Compose plugin (`docker compose`)
- `nginx`
- `certbot` and the nginx plugin if TLS is not already managed elsewhere

Create the workspace root if needed:

```bash
mkdir -p /root/workspace
```

Clone the repo:

```bash
cd /root/workspace
git clone https://github.com/benlagrone/unicornjump.git
cd /root/workspace/unicornjump
```

## 4) Release Discipline

Deploy by immutable commit SHA. Do not deploy directly from whatever `main` happens
to be at on the server.

Local pre-deploy checks:

```bash
cd /Users/benjaminlagrone/Documents/projects/games/unicornjump
git checkout main
git pull --ff-only
git status --short
git rev-parse --short HEAD
```

Expected:
- working tree clean for files that matter to the release
- commit hash matches the version you intend to ship

Record the exact release SHA:

```bash
RELEASE_SHA=$(git rev-parse HEAD)
echo "$RELEASE_SHA"
```

## 5) First Deployment on the VPS

```bash
cd /root/workspace/unicornjump
git fetch origin
git checkout --detach <RELEASE_SHA>
git rev-parse --short HEAD

docker compose up -d --build unicornjump-web
docker compose ps
```

Expected:
- the build completes successfully
- `unicornjump-web` is `Up`
- the service is reachable at `http://127.0.0.1:13081`

## 6) Redeploy an Updated Release

For every subsequent deploy:

```bash
cd /root/workspace/unicornjump
git fetch origin
git checkout --detach <RELEASE_SHA>
git rev-parse --short HEAD

docker compose up -d --build unicornjump-web
docker compose ps
```

If the compose file changes in a way that requires recreation, this command will
handle it. Use `docker compose logs --tail=200 unicornjump-web` if the container
does not come back cleanly.

## 7) Host Nginx Configuration

Host `nginx` should be the only public entrypoint. Keep the container bound to
loopback only.

Suggested upstream:

```nginx
upstream sapphirelagrone_game {
    server 127.0.0.1:13081;
}
```

Suggested server blocks:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name www.sapphirelagrone.com;
    return 301 https://sapphirelagrone.com$request_uri;
}

server {
    listen 80;
    listen [::]:80;
    server_name sapphirelagrone.com;

    location / {
        proxy_pass http://sapphirelagrone_game;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

If TLS is not yet configured:

```bash
sudo certbot --nginx -d sapphirelagrone.com -d www.sapphirelagrone.com
```

After any host nginx change:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 8) Verification Gates

### Gate 1: container is serving locally

```bash
curl -I http://127.0.0.1:13081/
curl -I http://127.0.0.1:13081/asset-manifest.json
```

Expected:
- root returns `200`
- the build manifest is reachable after a successful build

### Gate 2: public domain is live

```bash
curl -I https://sapphirelagrone.com/
curl -I https://www.sapphirelagrone.com/
```

Expected:
- apex returns `200`
- `www` returns `301` or `308` to apex if redirect is enabled

### Gate 3: manual smoke

Open the site in:
- desktop browser
- mobile browser

Verify:
- splash screen renders correctly
- gameplay starts without console-visible crashes
- controls work on the intended device class
- no ads, popups, or third-party interruptions are present in the daughter-safe build

## 9) Rollback

Define the previous known-good SHA before deploying.

Rollback steps:

```bash
cd /root/workspace/unicornjump
git fetch origin
git checkout --detach <PREVIOUS_GOOD_SHA>
git rev-parse --short HEAD

docker compose up -d --build unicornjump-web
docker compose ps
```

Then rerun the verification gates:
- local loopback `curl`
- public domain `curl`
- manual browser smoke

## 10) Operational Notes

- Keep the public container private to the host with a loopback bind such as
  `127.0.0.1:13081:80`. Do not expose the app container directly to the internet.
- Keep the first production build ad-free and interruption-free.
- If monetization is added later, prefer a separate build, path, or subdomain
  rather than mixing ads into the daughter-safe deployment.
- Avoid adding analytics, ad SDKs, or other third-party scripts until there is a
  specific product decision to do so.
- If runtime configuration is eventually needed, follow the Pericope pattern:
  build-time app config stays in the frontend image, while host/domain routing
  remains in host `nginx`.

## 11) Troubleshooting

Container not starting:

```bash
cd /root/workspace/unicornjump
docker compose logs --tail=200 unicornjump-web
docker compose ps
```

Host proxy issue:

```bash
sudo nginx -t
sudo systemctl status nginx --no-pager
curl -I http://127.0.0.1:13081/
```

Wrong version deployed:

```bash
cd /root/workspace/unicornjump
git rev-parse HEAD
git log --oneline -n 3
```

## 12) Canonical Deployment Path

The canonical production path for this repo is now:
- host clone at `/root/workspace/unicornjump`
- root `docker-compose.yml`
- app image built from `unicorn-jump/Dockerfile`
- container `nginx` serving the React build
- host `nginx` proxying `sapphirelagrone.com` to `127.0.0.1:13081`

If the deployment shape changes later, update this runbook first so the repo
remains the source of truth.
