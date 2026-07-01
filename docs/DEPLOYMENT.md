# Production Deployment Checklist

Use this as a release gate, not as a substitute for project-specific operations documentation.

## Before deployment

- [ ] The image or source revision is pinned to a known version.
- [ ] `ADMIN_USER`, `ADMIN_PASSWORD`, and `SESSION_SECRET` no longer use their public defaults.
- [ ] Secrets are unique, random, and stored outside Git.
- [ ] Persistent storage is mounted and writable by the service user.
- [ ] `data/subscription-dock.json` exists on persistent storage and has a tested backup.
- [ ] A fresh backup exists.

## Network and TLS

- [ ] Only the reverse proxy is exposed publicly.
- [ ] HTTPS is enabled and HTTP redirects to HTTPS.
- [ ] Forwarded headers and proxy trust are configured consistently.
- [ ] Cookie security settings match the public URL.
- [ ] Administrative endpoints are not unintentionally public.

## Application

- [ ] The container time and intended renewal dates have been checked.
- [ ] A reminder test succeeds.
- [ ] Guest mode cannot reveal or modify private data.
- [ ] `GET /healthz` is monitored; reminder delivery is tested separately.
- [ ] Logs do not contain passwords, tokens, notification credentials, or full session identifiers.

## Backup and recovery

- [ ] Consistent copies of `data/subscription-dock.json` or in-app exports are automated.
- [ ] Backup retention and encryption are defined.
- [ ] At least one restoration has been tested.
- [ ] The application version is recorded with every backup.

## Upgrade procedure

1. Read the release notes.
2. Back up persistent data.
3. Pull the pinned image or revision.
4. Rebuild and start the service.
5. Verify login, dashboard totals, a test notification, and JSON export.
6. Keep the previous artifact available until verification is complete.

## Incident basics

Document who receives alerts, how to disable outgoing notifications, where backups live, and how to return the service to a known-good version.
