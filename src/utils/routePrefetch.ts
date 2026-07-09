/**
 * Route Prefetch — hover-triggered route chunk prefetching
 *
 * When the user hovers over an internal link (<a href="/blog">),
 * we preload the target route's component chunk so navigation is instant.
 *
 * Performance impact: negligible — only triggers once per link per page load,
 * and the browser caches the prefetched chunk.
 */

import type { Router } from 'vue-router'

/** Track which routes have been prefetched to avoid duplicate work */
const prefetchedRoutes = new Set<string>()

/**
 * Install hover prefetch on a router instance.
 * Call once in main.ts after router is created.
 */
export function installRoutePrefetch(router: Router): void {
  if (typeof window === 'undefined') return

  // Prefetch on link hover
  document.addEventListener('mouseover', (e: MouseEvent) => {
    const target = (e.target as HTMLElement)?.closest('a')
    if (!target) return

    const href = target.getAttribute('href')
    if (!href || !href.startsWith('/')) return

    prefetchRoute(router, href)
  }, { passive: true })

  // Prefetch on link focus (keyboard accessibility)
  document.addEventListener('focusin', (e: FocusEvent) => {
    const target = (e.target as HTMLElement)?.closest('a')
    if (!target) return

    const href = target.getAttribute('href')
    if (!href || !href.startsWith('/')) return

    prefetchRoute(router, href)
  }, { passive: true })
}

/**
 * Prefetch a route's component chunk by resolving the route
 * and calling its lazy component loader.
 */
function prefetchRoute(router: Router, path: string): void {
  if (prefetchedRoutes.has(path)) return

  try {
    const resolved = router.resolve(path)
    if (!resolved.matched.length) return

    // Mark as prefetched before loading to prevent duplicates
    prefetchedRoutes.add(path)

    // Find the first matched route with a lazy component
    for (const record of resolved.matched) {
      const components = record.components
      if (!components) continue

      // Handle default component (could be function or object)
      const comp = components.default
      if (typeof comp === 'function') {
        // Lazy component — call the loader to prefetch the chunk
        ; (comp as () => Promise<unknown>)().catch(() => {
          // Silently ignore prefetch failures
        })
        break
      }
    }
  } catch {
    // Silently ignore resolution errors
  }
}

/**
 * Clear the prefetch cache (e.g., after route changes that invalidate chunks).
 * Not typically needed — browser cache handles this.
 */
export function clearPrefetchCache(): void {
  prefetchedRoutes.clear()
}