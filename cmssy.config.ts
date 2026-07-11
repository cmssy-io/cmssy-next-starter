import { defineCmssyConfig } from "@cmssy/next";

// defineCmssyConfig validates at startup and throws a listing error naming any
// missing env var - so pass process.env through raw. A `?? ""` fallback would
// defeat that and fail later, at request time, as a confusing upstream error.
export const cmssy = defineCmssyConfig({
  org: process.env.CMSSY_ORG_SLUG,
  workspaceSlug: process.env.CMSSY_WORKSPACE_SLUG,
  draftSecret: process.env.CMSSY_DRAFT_SECRET,
  // apiUrl: process.env.CMSSY_API_URL,
  // editorOrigin: process.env.CMSSY_EDITOR_ORIGIN,
});
