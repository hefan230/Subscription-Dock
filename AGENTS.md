# Subscription Dock Agent Notes

## Goal

Subscription Dock is a lightweight self-hosted subscription and recurring digital expense dashboard.

## Current Scope

- Keep the app simple and deployable on a small Ubuntu VPS.
- Avoid heavy dependencies unless a feature clearly needs them.
- Preserve the Docker deployment path.
- Keep user data portable through `data/subscription-dock.json`.

## Coding Rules

- Prefer small, readable modules over framework-heavy structure.
- Validate all API input on the server.
- Do not introduce build steps unless necessary.
- Keep the UI responsive and dark-mode first.
- Do not commit `.env` or runtime data files.

## Future Upgrade Path

- SQLite can replace JSON storage when multi-user or larger data volume is needed.
- Prisma can be introduced after the data model stabilizes.
- Notification providers should be provider-based: Pushover first, Telegram or Bark later.
