# cmssy starter

A minimal, runnable [Next.js](https://nextjs.org) (App Router) site powered by the
headless [cmssy](https://www.cmssy.io) CMS. Clone it, point it at a workspace, and you
have an editable, SEO-ready site with three example blocks.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cmssy-io/cmssy-next-starter&env=CMSSY_WORKSPACE_SLUG,CMSSY_DRAFT_SECRET&envDescription=Your%20cmssy%20workspace%20slug%20and%20draft%20secret%20from%20Settings%20-%20Headless&envLink=https://www.cmssy.io/docs/installation&project-name=cmssy-next-starter&repository-name=cmssy-next-starter)

> **Try it instantly.** To render the published demo content before creating your own
> workspace, set `CMSSY_WORKSPACE_SLUG=cmssy-demo`. `CMSSY_DRAFT_SECRET` is required by the
> config but is only verified for _draft preview_ (which needs your own workspace), so any
> 16+ character placeholder renders the published pages. For your own site, use the real
> secret generated under **Settings → Headless** (see below).

## What's inside

- **Zero-config SDK wiring** - one catch-all route renders every cmssy page; you only set
  a workspace slug and a draft secret.
- **Live visual editing** - the cmssy editor frames your running site and edits in place.
- **Three example blocks** that back the [block recipes](https://www.cmssy.io/docs/blocks):
  - `hero` - a content block with scalar fields and optional image/video, no loader.
  - `prose` - rich text, sanitized on the server with `sanitize-html` (XSS-safe).
  - `blog-index` - lists published child pages via the delivery API (`publicPagesByType`).

## Quickstart

```bash
git clone https://github.com/cmssy-io/cmssy-next-starter.git
cd cmssy-next-starter
npm install
cp .env.example .env        # then fill in the two values below
npm run dev                 # http://localhost:3000
```

### Environment

Only two values are required (cmssy cloud handles the rest):

| Variable               | Where to find it                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `CMSSY_WORKSPACE_SLUG` | cmssy dashboard -> Settings -> Headless                                                  |
| `CMSSY_DRAFT_SECRET`   | cmssy dashboard -> Settings -> Headless (generated per workspace - copy the exact value) |

`CMSSY_API_URL` and `CMSSY_EDITOR_ORIGIN` default to cmssy cloud and only need to be set
for local-backend or self-hosted development. See `.env.example`.

## Project structure

```
app/
  [[...path]]/page.tsx   catch-all: createCmssyPage + buildCmssyMetadata
  api/draft/route.ts     draft/preview mode entry (createDraftRoute)
  layout.tsx
blocks/
  hero/                  block.ts (defineBlock) + Hero.tsx
  prose/                 block.ts + Prose.tsx (sanitize-html in the loader)
  blog-index/            block.ts + BlogIndex.tsx + posts-query.ts + load-posts.ts
cmssy/
  blocks.ts              the block registry (single source of truth)
  editor.tsx             lazy-loads blocks for the visual editor
cmssy.config.ts          workspaceSlug + draftSecret
proxy.ts                 edit-mode detection + CSP (frame-ancestors)
styles/globals.css       your own design tokens (cmssy does not control styling)
```

## How it works

- **Rendering** - `app/[[...path]]/page.tsx` calls `createCmssyPage(cmssy, blocks, { editor })`.
  It fetches the published page for the current path and renders its blocks. SEO comes from
  `buildCmssyMetadata` in `generateMetadata`.
- **Editing** - the cmssy editor opens your site in an iframe. `proxy.ts` detects edit mode
  and relaxes CSP `frame-ancestors` so the editor can frame and live-patch blocks.
- **Drafts** - the editor hits `/api/draft?secret=<CMSSY_DRAFT_SECRET>` to enter preview mode
  and see unpublished content.
- **Server loaders** - a block's `loader` runs only on the server (never in the browser or the
  editor), so dependencies like `sanitize-html` and the GraphQL client stay out of the client
  bundle. See `blocks/prose` and `blocks/blog-index`.

## Add your own block

1. Create `blocks/<name>/block.ts` with `defineBlock({ type, props, component, loader? })`.
2. Add the component next to it.
3. Register it in `cmssy/blocks.ts`.

It then appears in the editor's block picker automatically. Full guide:
[Building blocks](https://www.cmssy.io/docs/block-development).

## Deploy

Use the **Deploy with Vercel** button above, or push to any Node 22+ host. Set the two
environment variables in your host's dashboard. After deploying, open the site in the cmssy
editor to start editing visually.

## Learn more

- [cmssy docs](https://www.cmssy.io/docs)
- [Installation](https://www.cmssy.io/docs/installation) · [Quickstart](https://www.cmssy.io/docs/quickstart)
- [Block recipes](https://www.cmssy.io/docs/blocks) · [Theming](https://www.cmssy.io/docs/theming)
