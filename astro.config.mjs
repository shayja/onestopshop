import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://onestopshop.co.il",
  integrations: [sitemap()],
});
