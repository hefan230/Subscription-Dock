# Contributing to Subscription Dock

Thanks for helping improve Subscription Dock. Small, focused contributions are easier to review and safer to release.

## Before you start

- Search existing issues and pull requests.
- Use a feature-request issue for significant behavior changes.
- Do not open public issues for security vulnerabilities; follow [SECURITY.md](SECURITY.md).
- Keep unrelated cleanup out of a functional change.

## Development setup

```bash
cp .env.example .env
node server.js
```

Use Node.js 22 or newer. There are no third-party runtime dependencies or build step. The development script in `package.json` uses POSIX environment syntax; on Windows, running `node server.js` is the portable option.

## Pull requests

1. Create a branch from the default branch.
2. Add or update tests when behavior changes.
3. Update both English and Chinese documentation when user-facing behavior changes.
4. Run `node --check server.js` and manually verify `/healthz` plus the affected UI path.
5. Complete the pull request template.

Use clear commit subjects such as:

```text
feat: add renewal reminder window
fix: preserve currency when editing a subscription
docs: clarify reverse proxy headers
```

Conventional Commits are encouraged but not required unless the repository later automates releases from them.

## Review expectations

Reviewers may ask for smaller scope, tests, migration notes, screenshots, accessibility improvements, or documentation updates. A pull request can be closed if it is unsafe, abandoned, or conflicts with the project direction.

## Translations

Keep `README_EN.md` and `README_CN.md` structurally aligned. Prefer natural language over word-for-word translation.

## Style

- Preserve the existing formatter and linter configuration.
- Avoid new dependencies when a small local implementation is sufficient.
- Validate all external input.
- Never log secrets or complete authentication tokens.
- Keep UI changes keyboard-accessible and readable in the dark theme.

## License

By contributing, you agree that your contribution may be distributed under the repository’s [GNU General Public License v3.0](LICENSE).
