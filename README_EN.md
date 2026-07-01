# Subscription Dock

[Home](README.md) · **English** · [中文](README_CN.md)

Subscription Dock is a lightweight self-hosted workspace for tracking subscriptions, recurring expenses, renewal dates, and reminders. Its backend uses only Node.js standard libraries, has no npm runtime dependencies, and stores all data in one portable JSON file.

## Table of contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Reverse proxy](#reverse-proxy)
- [Notifications](#notifications)
- [Backup and restore](#backup-and-restore)
- [Guest mode](#guest-mode)
- [Operations](#operations)
- [FAQ](#faq)
- [Contributing](#contributing)

## Features

- Centralized subscription and recurring-cost records.
- Monthly and yearly spending summaries.
- Sixteen currencies with manual rates and optional reference-rate refresh from Frankfurter.
- Renewal and expiration reminders.
- Dark dashboard interface.
- Docker-oriented self-hosting.
- Reverse-proxy-friendly deployment.
- Restricted guest experience.
- Pushover, Bark, and Telegram renewal reminders.
- JSON import and export.
- Chinese, English, and Japanese interface.
- Reusable 400×400 icon library.

## Requirements

For Docker, install Docker Engine with Docker Compose v2. For a direct source run, install Node.js 22 or newer. No database server, package installation, or build step is required.

## Installation

### Docker Compose

```bash
git clone <your-repository-url>
cd subscription-dock
cp .env.example .env
docker compose up -d --build
```

Before starting, edit `.env` and replace the default administrator credentials and session secret. Check service health after startup:

```bash
docker compose ps
docker compose logs --tail=100
```

Upgrade:

```bash
git pull --ff-only
docker compose pull
docker compose up -d --build
```

### Run from source

```bash
cp .env.example .env
node server.js
```

Open `http://localhost:3537`.

## Configuration

Copy `.env.example` to `.env`:

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3537` | Internal application port |
| `HOST` | `0.0.0.0` | Listen address; keep this value inside Docker |
| `ADMIN_USER` | `admin` | Administrator login name |
| `ADMIN_PASSWORD` | `admin` | Administrator password; change before deployment |
| `SESSION_SECRET` | placeholder | HMAC secret for the seven-day session cookie |
| `DATA_FILE` | `./data/subscription-dock.json` | JSON database path |
| `COOKIE_SECURE` | `false` | Set to `true` when the public site uses HTTPS |
| `TRUST_PROXY` | `false` | Set to `true` behind a trusted reverse proxy |

The server blocks an IP for 30 minutes after three failed login attempts. When `TRUST_PROXY=true`, make sure only your trusted proxy can reach the application.

## Reverse proxy

Terminate TLS at a trusted reverse proxy and forward traffic to the application’s internal port.

Example Nginx shape:

```nginx
server {
    listen 443 ssl http2;
    server_name subscriptions.example.com;

    location / {
        proxy_pass http://127.0.0.1:3537;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the production checklist.

## Notifications

Choose one channel in Settings:

- Pushover: API token and user key.
- Bark: server URL (defaults to `https://api.day.app`) and device key.
- Telegram: bot token and chat ID.

Set the number of days before renewal, save, then use the test button. The service checks after startup and every hour thereafter. A subscription and renewal date are notified only once for the configured lead time. Notification credentials are currently stored in the JSON data file, so protect backups accordingly.

## Backup and restore

All application data—including subscriptions, settings, uploaded icons, and notification state—is stored in `data/subscription-dock.json`. Use the Settings export button or copy the file consistently:

```bash
docker compose stop
# Copy the bound data directory or export the database here.
docker compose start
```

Importing a JSON backup replaces the current state. Export the current state before importing another file. Test restoration regularly; an untested backup is only a hopeful file.

## Guest mode

When enabled in Settings, unauthenticated visitors can use the guest button to view the overview and subscription list. They cannot add, edit, renew, delete, manage icons, change settings, import, or export. Guests can still see subscription information, so do not enable this mode for private production data.

## Operations

### Logs

```bash
docker compose logs -f --tail=200
```

Document sensitive fields that are redacted and the default log retention policy.

### Health and monitoring

The service exposes `GET /healthz`, which returns `{"ok":true}` when the HTTP process is serving requests. A production deployment should also monitor:

- HTTP availability.
- Scheduled reminder execution.
- Disk usage for the JSON data file and container logs.
- Backup freshness.

### Updating

Read [CHANGELOG.md](CHANGELOG.md) before upgrading. Back up data first and call out any manual migration in release notes.

## FAQ

### Does Subscription Dock connect to banks automatically?

No. Entries are managed manually.

### Can I use it without Docker?

Yes if the source runtime and database are documented. Docker remains the recommended path for reproducible self-hosting.

### How are currencies converted?

Rates are stored relative to USD. You can edit them manually or request reference rates from the public Frankfurter API. Dashboard conversion is for overview purposes, not accounting or trading.

### Why did I not receive a reminder?

Check the deployment time zone, provider credentials, notification logs, network access, and the configured lead time.

### Where is my data stored?

Docker mounts `./data` to `/app/data`; the default file is `data/subscription-dock.json` on the host.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Use the issue templates for bugs and feature proposals. Report vulnerabilities privately according to [SECURITY.md](SECURITY.md).

## License

Subscription Dock is available under the [MIT License](LICENSE).
