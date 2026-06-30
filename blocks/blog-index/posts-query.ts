// The delivery API exposes `publicPagesByType` for listing published pages under
// a parent. `queryScoped` injects `$workspaceId` for you (see load-posts.ts).
export const PUBLIC_PAGES_BY_TYPE = `query PublicPagesByType(
  $workspaceId: String!
  $parentSlug: String
  $limit: Int
  $offset: Int
) {
  publicPagesByType(
    workspaceId: $workspaceId
    parentSlug: $parentSlug
    limit: $limit
    offset: $offset
  ) {
    items {
      id
      slug
      fullSlug
      publishedAt
      displayName
      seoTitle
      seoDescription
    }
    hasMore
  }
}`;
