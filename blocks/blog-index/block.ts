import { defineBlock, fields } from "@cmssy/react";
import BlogIndex from "./BlogIndex";

// Lists published child pages under `parentSlug`. There is no SDK helper for
// this - the loader runs the delivery-API query (see load-posts.ts). The loader
// does not run in the editor, so the component guards on missing `data`.
export const blogIndexBlock = defineBlock({
  type: "blog-index",
  label: "Blog index",
  component: BlogIndex,
  props: {
    parentSlug: fields.singleLine({
      label: "Parent slug",
      placeholder: "/blog",
    }),
    postsPerPage: fields.numeric({ label: "Posts per page", defaultValue: 9 }),
  },
  loader: async ({ content }) => {
    const parentSlug =
      typeof content.parentSlug === "string" ? content.parentSlug : "";
    if (!parentSlug) return null;
    const { loadPosts } = await import("./load-posts");
    return loadPosts({ parentSlug, limit: Number(content.postsPerPage) || 9 });
  },
});
