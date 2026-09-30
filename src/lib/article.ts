// Build-time enhancement of a rendered guide page: gives every h2 inside
// <article> an id, puts breadcrumbs (+ BreadcrumbList JSON-LD) above the h1,
// the meta line (date, reading time) and table of contents after it, and a
// closed-price box before the FAQ on website-planning guides. Pure string work on the
// HTML Astro already rendered, so the 19 guide pages need no markup edits.

import { categoryOf } from "../data/guides";
import { packages } from "../data/packages";

const WORDS_PER_MINUTE = 200;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const stripTags = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const hebrewDate = (iso: string) =>
  new Intl.DateTimeFormat("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jerusalem",
  }).format(new Date(iso));

interface Options {
  path: string;
  datePublished: string;
  dateModified?: string;
}

export function enhanceArticle(html: string, opts: Options): string {
  const start = html.indexOf("<article");
  const end = html.indexOf("</article>", start);
  if (start === -1 || end === -1) return html;

  let body = html.slice(start, end);
  const words = stripTags(body).split(" ").length;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));

  const toc: { id: string; text: string }[] = [];
  body = body.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g, (_m, attrs: string, inner: string) => {
    const existing = attrs.match(/\bid="([^"]+)"/);
    const id = existing ? existing[1] : `section-${toc.length + 1}`;
    toc.push({ id, text: stripTags(inner) });
    return existing ? `<h2${attrs}>${inner}</h2>` : `<h2 id="${id}"${attrs}>${inner}</h2>`;
  });

  const category = categoryOf(opts.path);
  const updated = opts.dateModified ?? opts.datePublished;
  const sep = '<span class="sep" aria-hidden="true">·</span>';
  const meta = [
    `<span>עודכן <time datetime="${esc(updated)}">${hebrewDate(updated)}</time></span>`,
    `<span>${minutes} דקות קריאה</span>`,
  ].join(sep);

  let insert = `<p class="article-meta">${meta}</p>`;

  if (toc.length >= 3) {
    const items = toc
      .map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`)
      .join("");
    // Two renditions of the same list: a collapsed disclosure in the text
    // column on small screens, a sticky rail beside it on wide ones.
    insert +=
      `<details class="toc toc-inline"><summary>בעמוד הזה</summary><ol>${items}</ol></details>` +
      `<nav class="toc-rail" aria-label="בעמוד הזה"><div class="toc-sticky"><p class="toc-title">בעמוד הזה</p><ol>${items}</ol></div></nav>`;
  }

  body = body.replace(/<\/h1>/, `</h1>${insert}`);

  const title = stripTags(body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "");
  const crumbs = [
    { name: "מדריכים", href: "/guides/" },
    ...(category ? [{ name: category.label, href: `/guides/#${category.id}` }] : []),
  ];
  const trail = crumbs
    .map((c) => `<a href="${c.href}">${esc(c.name)}</a>`)
    .join('<span aria-hidden="true"> › </span>');
  const breadcrumbLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [...crumbs, { name: title, href: opts.path }].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `https://onestopshop.co.il${c.href}`,
    })),
  }).replace(/</g, "\\u003c");
  body = body.replace(
    /<h1/,
    `<nav class="breadcrumbs" aria-label="פירורי לחם">${trail}</nav>` +
      `<script type="application/ld+json">${breadcrumbLd}</script><h1`,
  );

  if (category?.id === "planning") {
    const price = (k: keyof typeof packages) =>
      `<li><span>${esc(packages[k].name)}</span><strong>${esc(packages[k].price)}</strong></li>`;
    const callout =
      `<aside class="price-callout" aria-label="המחירים אצלנו">` +
      `<p class="price-callout-kicker">ואצלנו, במחיר סגור (לפני מע״מ):</p>` +
      `<ul>${price("landing")}${price("brochure")}${price("business")}</ul>` +
      `<a class="btn btn-primary" href="/#quote">איזה מהם מתאים לכם?</a>` +
      `</aside>`;
    const faqAt = body.search(/<h2[^>]*>שאלות נפוצות<\/h2>/);
    if (faqAt !== -1) body = body.slice(0, faqAt) + callout + body.slice(faqAt);
  }
  return html.slice(0, start) + body + html.slice(end);
}
