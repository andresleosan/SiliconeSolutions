# Release: Social Share Preview

Date: 2026-08-20

## Changes

- Added a repository-owned `1200 x 630` PNG preview image at `/og-image.png`.
- Added canonical, Open Graph, and Twitter metadata for `https://siliconesolutions.pages.dev`.
- Added `twitter:image:alt` and exact metadata/image E2E coverage.
- Added a reproducible Sharp generator via `corepack pnpm run social:prepare`.

## Verification

- Production export build passed.
- Playwright E2E: `26/26` passed.
- Unit tests: `8/8` passed.
- Lint and TypeScript passed.
- Media verification passed.
- Dependency audit passed with no high-severity vulnerabilities.

## Rollback

If the social preview causes a production issue, revert the feature commits in reverse order and push the resulting revert commit:

```sh
git revert --no-edit 8fa9f472 39999cb4 dfc1f1c5 05ec9b33 019b2c3f
git push origin main
```

This returns the application behavior to the pre-feature commit `bcb5fd95` while retaining the earlier documentation and worktree-ignore commits.
