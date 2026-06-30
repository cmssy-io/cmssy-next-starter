import { defineBlock, fields } from "@cmssy/react";
import Prose from "./Prose";

// Rich text is just an HTML string from the CMS - the SDK does not sanitize it.
// Sanitize on the server in the loader so `sanitize-html` stays out of the
// client bundle, then render the clean HTML in the component.
export const proseBlock = defineBlock({
  type: "prose",
  label: "Prose",
  component: Prose,
  props: {
    body: fields.richText({ label: "Body" }),
  },
  loader: async ({ content }) => {
    const html = typeof content.body === "string" ? content.body : "";
    if (!html) return { html: "" };
    const { default: sanitizeHtml } = await import("sanitize-html");
    const clean = sanitizeHtml(html, {
      allowedTags: [
        "p",
        "strong",
        "em",
        "ul",
        "ol",
        "li",
        "a",
        "h2",
        "h3",
        "br",
      ],
      allowedAttributes: { a: ["href", "target", "rel"] },
      allowedSchemes: ["http", "https", "mailto", "tel"],
    });
    return { html: clean };
  },
});
