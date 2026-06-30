import { CmssyLink } from "@cmssy/next/client";
import type { CmssyBlockContext } from "@cmssy/react";
import type { Localized, Post } from "./load-posts";

// Translatable page fields come back language-keyed; resolve to the active
// locale (falling back to the default, then any available value).
function pickLocale(
  value: Localized,
  locale?: CmssyBlockContext["locale"],
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  const keys = locale ? [locale.current, locale.default] : ["en"];
  for (const key of keys) {
    if (value[key]) return value[key];
  }
  return Object.values(value)[0] ?? "";
}

// `data` comes from the loader; absent in the editor (loader does not run there).
export default function BlogIndex({
  data,
  context,
}: {
  data?: { items?: Post[]; hasMore?: boolean } | null;
  context?: CmssyBlockContext;
}) {
  const items = data?.items ?? [];
  const locale = context?.locale;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 text-center text-muted-foreground">
        No posts yet.
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((post) => {
        const title =
          pickLocale(post.displayName, locale) ||
          pickLocale(post.seoTitle, locale) ||
          post.slug;
        const excerpt = pickLocale(post.seoDescription, locale);
        return (
          <CmssyLink
            key={post.id}
            href={`/${post.fullSlug.replace(/^\/+/, "")}`}
            className="group block rounded-xl border border-border p-6 transition-colors hover:border-foreground/30"
          >
            {post.publishedAt && (
              <time
                dateTime={post.publishedAt}
                className="text-xs text-muted-foreground"
              >
                {new Date(post.publishedAt).toLocaleDateString()}
              </time>
            )}
            <h3 className="mt-2 text-lg font-semibold group-hover:text-primary">
              {title}
            </h3>
            {excerpt && (
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {excerpt}
              </p>
            )}
          </CmssyLink>
        );
      })}
    </div>
  );
}
