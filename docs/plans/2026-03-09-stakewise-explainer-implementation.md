# StakeWise Exit Queue Explainer -- Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a neo-brutalist single-page explainer about StakeWise V3 exit queue mechanics, deployed to Cloudflare Workers.

**Architecture:** Bun + Hono worker serving inline HTML/CSS. Video hosted on IPFS. Static content from analysis markdown baked into the template.

**Tech Stack:** Bun, Hono, Cloudflare Workers, wrangler, bun-ipfs

---

### Task 1: Upload Video to IPFS

**Step 1: Upload the .mov file**

Run:
```bash
cd ~/Developer/bun-ipfs && bun run src/index.ts "/Users/mark.phillips/Developer/jung-ethereum-staking/Screen Recording 2026-03-08 at 16.28.39.mov" --no-qr
```

Expected: CID output and report JSON.

**Step 2: Record the CID**

Save the IPFS CID for use in Task 4. Verify gateway access:
```bash
curl -I "https://ipfs.io/ipfs/<CID>"
```

---

### Task 2: Initialize Bun + Hono Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `wrangler.jsonc`

**Step 1: Initialize package.json**

```bash
cd /Users/mark.phillips/Developer/jung-ethereum-staking
bun init -y
```

**Step 2: Install dependencies**

```bash
bun add hono
bun add -D wrangler @cloudflare/workers-types
```

**Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx",
    "types": ["@cloudflare/workers-types"]
  },
  "include": ["src"]
}
```

**Step 4: Create wrangler.jsonc**

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "jung-ethereum-staking",
  "main": "src/index.ts",
  "compatibility_date": "2026-03-01",
  "compatibility_flags": ["nodejs_compat_v2"]
}
```

**Step 5: Update package.json scripts**

Add to scripts:
```json
{
  "dev": "wrangler dev",
  "deploy": "wrangler deploy"
}
```

**Step 6: Commit**

```bash
git init
git add package.json tsconfig.json wrangler.jsonc bun.lock
git commit -m "init: bun + hono + wrangler project scaffold"
```

---

### Task 3: Create Hono Worker with Neo-Brutalist HTML

**Files:**
- Create: `src/index.ts`

**Step 1: Create src directory**

```bash
mkdir -p src
```

**Step 2: Write src/index.ts**

Single file containing:
- Hono app with GET `/` route
- Full HTML document with inline `<style>` block
- Neo-brutalist CSS: IBM Plex Mono, 3px black borders, 8px hard-offset shadows, #FFD600 accent, #FF3333 status
- Sections: hero, video (IPFS CID placeholder), tx summary, decoded params table, 3-step claiming guide, timeline, links
- All content from stakewise-exit-queue-analysis.md baked in
- Responsive: max-width 800px, mobile-friendly
- `<video>` tag with IPFS gateway src, controls, poster fallback text

**Step 3: Run dev server**

```bash
bun run dev
```

Verify at http://localhost:8787 -- page renders with all sections, video placeholder works.

**Step 4: Commit**

```bash
git add src/index.ts
git commit -m "feat: neo-brutalist stakewise exit queue explainer page"
```

---

### Task 4: Insert IPFS Video CID

**Files:**
- Modify: `src/index.ts` -- replace CID placeholder with actual CID from Task 1

**Step 1: Update video src**

Replace `{IPFS_CID}` in the `<video>` tag with the real CID.

**Step 2: Test locally**

```bash
bun run dev
```

Verify video loads from IPFS gateway.

**Step 3: Commit**

```bash
git add src/index.ts
git commit -m "feat: embed IPFS-hosted video with CID"
```

---

### Task 5: Deploy to Cloudflare Workers

**Step 1: Verify wrangler auth**

```bash
wrangler whoami
```

**Step 2: Deploy**

```bash
bun run deploy
```

Expected: Deployment URL printed.

**Step 3: Verify live site**

```bash
curl -I https://jung-ethereum-staking.<account>.workers.dev
```

**Step 4: Commit any deploy artifacts**

```bash
git add -A && git commit -m "chore: post-deploy config"
```

---

### Task 6: Create GitHub Repo and Push

**Step 1: Create repo**

```bash
gh repo create tankbottoms/jung-ethereum-staking --public --source=. --push
```

**Step 2: Fix remote to SSH alias**

```bash
git remote set-url origin git@tankbottoms.github.com:tankbottoms/jung-ethereum-staking.git
git push -u origin main
```
