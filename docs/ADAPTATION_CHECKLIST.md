# Publishing Checklist

The documentation has been matched to the current source in `C:\Users\shigu\Desktop\xm`. Complete the repository-identity and release steps below before publishing.

## Repository identity

- [ ] Replace `<your-repository-url>` / `<你的仓库地址>`.
- [x] Confirm the canonical project name and casing.
- [ ] Add real repository-specific Stars and Release badges if desired.
- [ ] Add maintainer or organization contact links.

## Runtime and installation

- [x] Confirm Node.js 22 and the dependency-free start command.
- [x] Confirm there is no build step or npm runtime dependency.
- [x] Confirm port `3537` and bind addresses.
- [x] Confirm the Compose service and persistent JSON path.
- [x] Confirm the current `.env.example` variables.

## Product behavior

- [x] Verify the 16 currencies and USD-relative exchange-rate logic.
- [x] Document Pushover, Bark, and Telegram.
- [x] Explain startup/hourly reminder scheduling and deduplication.
- [x] Define guest-mode permissions.
- [x] Confirm JSON export/import and filesystem backup.
- [x] Match public feature statements to the current implementation.

## Screenshots

- [x] Add `screenshot-dashboard.png`.
- [x] Add `screenshot-subscriptions.png`.
- [x] Use the supplied real-product overview and subscriptions images.

## GitHub settings

- [ ] Create a repository social preview from the real product screenshots if desired.
- [ ] Enable private vulnerability reporting.
- [ ] Configure branch protection and required CI checks.
- [ ] Set the repository description, website, and topics.
- [ ] Create the first release from the release template.

## Legal and governance

- [ ] Confirm that MIT is the intended license and replace the generic copyright holder if needed.
- [ ] Add the real security contact or enable GitHub private reporting.
- [ ] Review contribution and conduct policies for maintainer preferences.
