# Architecture

A complete, buildable Next.js (App Router) app wired to the headless cmssy CMS. Next is pinned in
`package.json`; the repo powers GitHub "Use this template" and the Vercel 1-click Deploy.

## The cmssy overlay

These cmssy-specific files are the canonical scaffold "overlay" - the set `cmssy init` applies onto a
fresh `create-next-app@latest` (everything else is stock Next):

- `cmssy.config.ts` - zero-config (`workspaceSlug` + `draftSecret`; locales read from the platform)
- `app/[[...path]]/page.tsx` - catch-all (`createCmssyPage` + `buildCmssyMetadata`)
- `app/api/draft/route.ts` - draft/preview (`createDraftRoute`)
- `proxy.ts` - edit-mode detection + CSP
- `cmssy/blocks.ts` - block registry
- `cmssy/editor.tsx` - lazy editor
- `blocks/**` - example blocks (`hero`, `prose`, `blog-index`)
- deltas: `next.config.mjs` image `remotePatterns`; `styles/globals.css` typography plugin + tokens;
  deps `@cmssy/next`, `@cmssy/react`, `sanitize-html`

Stock Next files (`app/layout.tsx`, `package.json` base, `tsconfig.json`, `eslint.config.mjs`,
`postcss.config.mjs`) come from `create-next-app`; `init` removes the default `app/page.tsx` (the
catch-all owns `/`).
