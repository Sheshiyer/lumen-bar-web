# LumenBar website

Official site for [lumenbar.thoughtseed.space](https://lumenbar.thoughtseed.space).

This repository is separate from the [LumenBar app](https://github.com/Sheshiyer/lumen-bar). It is a Vite, React, and TypeScript page published with Cloudflare Pages on the Thoughtseed Labs account.

## Local preview

```bash
npm ci
npm run dev
```

## Publish

The production Pages project is `lumenbar-site` on account `9d7cec1b5a32b2df8c6cdc1321ccd00b`. Clear any personal Cloudflare variables before deploying so they cannot retarget the account.

```bash
unset CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID CLOUDFLARE_API_KEY CLOUDFLARE_EMAIL CF_API_TOKEN CF_ACCOUNT_ID
npm run build
npx wrangler pages deploy dist --project-name lumenbar-site --branch main --profile thoughtseed-labs
```
