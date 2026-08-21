# Release: Social Share Preview

Date: 2026-08-20

## Changes

- Added a repository-owned `1200 x 630` PNG preview image at `/og-image.png`.
- Added canonical, Open Graph, and Twitter metadata for `https://siliconesolutions.pages.dev`.
- Added `twitter:image:alt` and exact metadata/image E2E coverage.
- Added a reproducible Sharp generator via `corepack pnpm run social:prepare`.

## V2 Changes

- Added the versioned `1200 x 630` JPEG preview at `/og-image-v2.jpg` while retaining `/og-image.png` for rollback.
- Updated Open Graph and Twitter metadata to use the JPEG with `image/jpeg` type metadata.
- Simplified the mobile contact bar to transparent chrome with navy WhatsApp and orange Call Now actions.
- Hid the comparison label on the narrow side and changed the comparison handle to navy with warm-white content.

## Verification

- Production export build passed.
- Playwright E2E: `26/26` passed.
- Unit tests: `8/8` passed.
- Lint and TypeScript passed.
- Media verification passed.
- Dependency audit passed with no high-severity vulnerabilities.

V2 pre-deployment verification:

- Production-export E2E: `27/27` passed.
- Unit tests: `8/8` passed.
- Lint, TypeScript, media verification, and dependency audit passed.
- Exported metadata references `/og-image-v2.jpg` and the JPEG reports `1200 x 630`.

Production verification will be recorded after the Cloudflare Pages deployment.

## Rollback

If the social preview causes a production issue, revert the feature commits in reverse order and push the resulting revert commit:

```sh
git revert --no-edit 8fa9f472 39999cb4 dfc1f1c5 05ec9b33 019b2c3f
git push origin main
```

This returns the application behavior to the pre-feature commit `bcb5fd95` while retaining the earlier documentation and worktree-ignore commits.

For V2, revert the V2 application and asset commits in reverse order and push the resulting revert commit:

```sh
git revert --no-edit 7da8f759 5cc1e458 0bb6e151 54bf729c 8c8af86c 644a4e36
git push origin main
```

This restores the prior `/og-image.png` metadata while retaining the rollback PNG and release documentation.
