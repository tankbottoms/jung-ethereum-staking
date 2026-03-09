# StakeWise Exit Queue Explainer -- Design

**Date:** 2026-03-09
**Stack:** Bun + Hono + Cloudflare Workers
**Style:** Neo-brutalist (IBM Plex Mono, hard shadows, thick borders, yellow accent)

## Architecture

Single Hono worker serving an HTML page with inline CSS. Video hosted on IPFS.

```
src/index.ts        -- Hono app, HTML template
wrangler.toml       -- CF Workers config
package.json        -- bun, hono, wrangler
tsconfig.json       -- TS config
```

## Content Sections

1. Hero -- title, vault name, date
2. Video -- IPFS-hosted .mov with controls
3. Transaction Summary -- TX hash, contract, method, status badge
4. Decoded Parameters -- shares, receiver, position ticket table
5. How to Claim -- 3-step process with code blocks
6. Timeline -- entered -> processing -> claimable
7. Links -- Etherscan, StakeWise app

## Style Tokens

- Font: `"IBM Plex Mono", monospace`
- BG: `#FFFFFF`, text: `#000000`, accent: `#FFD600`, status: `#FF3333`
- Borders: `3px solid #000`
- Shadows: `8px 8px 0 #000`
- Badges: rectangular, uppercase, bold
- Code: black bg, green text
- Max-width: 800px centered
- Responsive: stacks on mobile

## Video Hosting

Upload 180MB .mov to IPFS via bun-ipfs. Embed with gateway URL.

## Deployment

`wrangler deploy` to Cloudflare Workers.
