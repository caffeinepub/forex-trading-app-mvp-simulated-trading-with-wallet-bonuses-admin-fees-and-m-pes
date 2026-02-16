/**
 * Generates a shareable URL for the current page using hash-based routing.
 * This ensures the link works correctly when deployed to a canister,
 * where server-side routing is not available.
 */
export function getShareableLink(): string {
  const { origin, pathname, hash } = window.location;
  
  // Hash-based routing format: https://example.com/#/path
  // If no hash exists, default to root
  const hashPath = hash || '#/';
  
  // For canister deployments, preserve the full base path
  // The pathname might include canister-specific routing context
  const basePath = pathname === '/' ? '' : pathname;
  
  return `${origin}${basePath}${hashPath}`;
}
