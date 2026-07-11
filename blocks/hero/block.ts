import { defineBlock, fields } from "@cmssy/react";
import Hero from "./Hero";

// A simple content block: plain scalar fields, no loader. The component renders
// nothing until a heading is set, so an empty block is invisible on the page.
export const heroBlock = defineBlock({
  type: "hero",
  label: "Hero",
  component: Hero,
  props: {
    badgeText: fields.text({ label: "Badge" }),
    heading: fields.text({ label: "Heading", required: true }),
    headingHighlight: fields.text({ label: "Heading highlight" }),
    subheading: fields.textarea({ label: "Subheading" }),
    primaryButtonText: fields.text({ label: "Primary button text" }),
    primaryButtonUrl: fields.link({ label: "Primary button URL" }),
    secondaryButtonText: fields.text({ label: "Secondary button text" }),
    secondaryButtonUrl: fields.link({ label: "Secondary button URL" }),
    media: fields.media({ label: "Media (image or video)" }),
  },
});
