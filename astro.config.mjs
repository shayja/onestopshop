import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://onestopshop.co.il",
  integrations: [sitemap()],
  // Prefetch internal links on hover/tap so guide-to-guide navigation is
  // near-instant; the pages are small static HTML, so the cost is tiny.
  prefetch: {
    prefetchAll: true,
  },
  build: {
    // GitHub Pages caps Cache-Control at 10 minutes, so an external stylesheet has no real repeat-visit value - inlining it removes the render-blocking request from the critical path (LCP/FCP).
    inlineStylesheets: "always",
  },
});
