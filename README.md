# cmssy starter

A minimal, runnable [Next.js](https://nextjs.org) (App Router) site powered by the
headless [cmssy](https://www.cmssy.com) CMS. Clone it, point it at a workspace, and you
have an editable, SEO-ready site with three example blocks.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cmssy-io/cmssy-next-starter&env=CMSSY_ORG_SLUG,CMSSY_WORKSPACE_SLUG,CMSSY_DRAFT_SECRET&envDescription=Your%20cmssy%20org%20slug,%20workspace%20slug%20and%20draft%20secret%20from%20Settings%20-%20Headless&envLink=https://www.cmssy.com/docs/installation&project-name=cmssy-next-starter&repository-name=cmssy-next-starter)

> **Try it instantly.** To render the published demo content before creating your own
> workspace, set `CMSSY_WORKSPACE_SLUG=cmssy-demo`. `CMSSY_DRAFT_SECRET` is required by the
> config but is only verified for _draft preview and editing_ (which need your own
> workspace), so any 16+ character placeholder renders the published pages. For your own
> site, link the real secret with `cmssy link` (see below).

## What's inside

- **Zero-config SDK wiring** - one catch-all route renders every cmssy page; the
  middleware preset (`createCmssyProxy`) handles locales, edit mode and CSP.
- **Live visual editing** - the cmssy editor frames your running site and edits in place.
  Only a request that proves itself with the workspace draft secret ever enters edit mode.
- **Schema-typed blocks** - each block exports its field schema and the component is typed
  `BlockProps<typeof props>`, so a renamed field is a compile error, not an empty block.
- **Four example blocks** that back the [block recipes](https://www.cmssy.com/docs/blocks):
  - `hero` - a content block with scalar fields and optional image/video, no loader.
  - `prose` - rich text, sanitized on the server with `sanitize-html` (XSS-safe).
  - `blog-index` - lists published child pages via the delivery API (`public.page.byType`).
  - `testimonials` - the "models for data, blocks for view" reference: records of a
    `testimonial` model (fields `quote`, `author`, `role`, `order`) bound with
    `fields.relation({ mode: "all", sort: "order_asc" })` and resolved server-side -
    no loader, no ids in the component, no record data trapped in block props.

## Quickstart

```bash
git clone https://github.com/cmssy-io/cmssy-next-starter.git
cd cmssy-next-starter
pnpm install                        # npm install works too
npx @cmssy/cli link --token cs_...  # writes .env.local and verifies the wiring
pnpm dev                            # http://localhost:3000
```

`cmssy link` connects the app to your workspace: it fetches the slugs and the draft
secret with a `cs_...` API token (dashboard → **API Tokens**), writes them to
`.env.local`, verifies the workspace is reachable and the secret is valid, and prints
the editor deep link. Prefer it to hand-copying values; if you do copy by hand, use
`.env.example` as the template.

### Wiring your own app instead

This repo is a reference, not a required starting point. To add cmssy to an app you
already have (or a fresh `npx create-next-app`), generate exactly this wiring with:

```bash
npx @cmssy/cli init   # detects your framework, writes the cmssy wiring (idempotent)
npx @cmssy/cli link   # connects it to your workspace
```

### Environment

Only three values are required (cmssy cloud handles the rest):

| Variable               | What it is                                                           |
| ---------------------- | -------------------------------------------------------------------- |
| `CMSSY_ORG_SLUG`       | Organization slug (Settings → Headless)                              |
| `CMSSY_WORKSPACE_SLUG` | Workspace slug (Settings → Headless)                                 |
| `CMSSY_DRAFT_SECRET`   | Server-only secret gating drafts and edit mode (Settings → Headless) |

## Project structure

```
app/
  [[...path]]/page.tsx        catch-all: createCmssyPage + buildCmssyMetadata
  cmssy-edit/[[...path]]/     dedicated dynamic route for verified editor requests
  api/draft/route.ts          draft preview enter/exit (createDraftRoute)
  sitemap.ts, robots.ts       SEO from the workspace's published pages
  layout.tsx                  header/footer layout blocks via CmssyLayoutSlot
blocks/                       each block is self-styled with a co-located CSS Module
  hero/                       Hero.tsx (schema + component) + block.ts + Hero.module.css
  prose/                      sanitize-html runs in the server loader
  blog-index/                 delivery-API query in a server-only loader helper
cmssy/
  blocks.ts                   the block registry (single source of truth)
  editor.tsx                  lazy-loads blocks for the visual editor
  editable-layout.tsx         mounts layout blocks through the edit bridge
cmssy.config.ts               org + workspaceSlug + draftSecret
proxy.ts                      createCmssyProxy: locale, verified edit rewrite, CSP
styles/globals.css            plain base styles - cmssy does not control styling (no Tailwind)
```

## How it works

- **Rendering** - `app/[[...path]]/page.tsx` calls `createCmssyPage(cmssy, blocks, { editor })`.
  It fetches the page for the current path and renders its blocks. SEO comes from
  `buildCmssyMetadata` in `generateMetadata`, plus `app/sitemap.ts` and `app/robots.ts`.
- **Editing (verified)** - the cmssy editor frames your site with `?cmssyEdit=1` **and** a
  `cmssySecret` that must match the workspace draft secret. `createCmssyProxy` in
  `proxy.ts` verifies that server-side and rewrites the request onto
  `/cmssy-edit/[[...path]]` - a route that is dynamic by design, because a static public
  page never sees the query string. An unverified `?cmssyEdit=1` renders published
  content like any other request. The proxy also applies the CSP `frame-ancestors` so
  only the cmssy admin (`https://www.cmssy.io`) can frame the site.
- **Drafts** - `/api/draft?secret=<CMSSY_DRAFT_SECRET>&redirect=/` enables Next draft
  mode for reviewing unpublished content on the public routes, without the editor.
  Exit with `/api/draft?disable=1`.
- **Layout blocks** - the header and footer are cmssy layout blocks. `CmssyLayoutSlot`
  in `app/layout.tsx` renders them server-side for visitors and through the edit bridge
  (`cmssy/editable-layout.tsx`) in the editor, so they stay editable.
- **Server loaders** - a block's `loader` runs only on the server (never in the browser
  or the editor), so dependencies like `sanitize-html` and the GraphQL client stay out
  of the client bundle. See `blocks/prose` and `blocks/blog-index`.
- **Locales** - the workspace (Settings → Languages) is the only source of default and
  enabled languages; nothing is configured in `cmssy.config.ts`.

## Add your own block

1. Put the field schema and the component in `blocks/<name>/<Name>.tsx`:

   ```tsx
   import { fields, type BlockProps } from "@cmssy/react";

   export const calloutProps = {
     text: fields.text({ label: "Text", required: true }),
   };

   export default function Callout({
     content,
   }: BlockProps<typeof calloutProps>) {
     return <aside>{content.text}</aside>;
   }
   ```

2. Define the block in `blocks/<name>/block.ts`:

   ```ts
   import { defineBlock } from "@cmssy/react";
   import Callout, { calloutProps } from "./Callout";

   export const calloutBlock = defineBlock({
     type: "callout",
     label: "Callout",
     component: Callout,
     props: calloutProps,
   });
   ```

3. Register it in `cmssy/blocks.ts`.

It then appears in the editor's block picker automatically. Full guide:
[Building blocks](https://www.cmssy.com/docs/block-development).

## Deploy

Use the **Deploy with Vercel** button above, or push to any Node 22+ host. Set the three
environment variables in your host's dashboard, then point the workspace at the deployed
origin (`npx @cmssy/cli link --preview-url https://your-site.example`) and open the site
in the cmssy editor to start editing visually.

## Learn more

- Built on the cmssy SDK: [`@cmssy/next` + `@cmssy/react`](https://github.com/cmssy-io/cmssy-sdk)
- [cmssy docs](https://www.cmssy.com/docs)
- [Installation](https://www.cmssy.com/docs/installation) · [Quickstart](https://www.cmssy.com/docs/quickstart)
- [Block recipes](https://www.cmssy.com/docs/blocks) · [Theming](https://www.cmssy.com/docs/theming)
