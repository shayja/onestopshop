// Contact-link assembly, GA4 click events, mobile menu, mobile action bar, reading progress, table-of-contents highlight. Without this file the page still renders, but contact CTAs keep their placeholder href="#" - the real WhatsApp/email links only exist at runtime.
import { waHref, email, phone } from "./contact.js";

// Contact links get their real targets at runtime (see contact.js).
(function () {
  // New tab keeps the page alive, so the GA4 click event queued below can still be sent once the delayed gtag.js finishes loading.
  document.querySelectorAll(".wa-link").forEach((a) => {
    a.href = waHref();
    a.target = "_blank";
    a.rel = "noopener";
  });

  document.querySelectorAll(".email-link").forEach((a) => {
    a.href = "mailto:" + email;
  });

  // Add contact details to the JSON-LD so crawlers that render JS (Google) see them, while keeping them out of the static HTML. Pages can carry several JSON-LD blocks (Article, FAQPage, ...) in any order - only the business schema gets the contact details.
  document
    .querySelectorAll('script[type="application/ld+json"]')
    .forEach((ld) => {
      try {
        const data = JSON.parse(ld.textContent);
        if (data["@type"] === "ProfessionalService") {
          data.telephone = phone;
          data.email = email;
          ld.textContent = JSON.stringify(data);
        }
      } catch {
        // Malformed JSON-LD - leave it untouched.
      }
    });
})();

// GA4: report contact clicks (no-op when analytics is blocked or absent).
(function () {
  const track = (selector, eventName) => {
    document.querySelectorAll(selector).forEach((a) => {
      a.addEventListener("click", () => {
        if (typeof gtag === "function") gtag("event", eventName);
      });
    });
  };
  track(".wa-link", "whatsapp_click");
  track(".email-link", "email_click");
})();

// Mobile menu (<details>): close on link tap, Escape, or a tap outside.
const menu = document.querySelector(".nav-menu");

if (menu) {
  const close = () => menu.removeAttribute("open");
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.open) {
      close();
      menu.querySelector("summary").focus();
    }
  });
  document.addEventListener("click", (e) => {
    if (menu.open && !menu.contains(e.target)) close();
  });
}

// Mobile action bar - appears once the first screen (hero or h1) scrolls away,
// so it never covers the hero's own call to action.
const firstScreen = document.querySelector(".hero, .packages-hero, main h1");
const actionBar = document.querySelector(".action-bar");

if (firstScreen && actionBar && "IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => {
    actionBar.classList.toggle("visible", !entry.isIntersecting);
  }).observe(firstScreen);
}

// Reading progress on guide pages (transform only, one rAF per scroll burst).
const progress = document.querySelector(".read-progress span");
const article = document.querySelector(".article article");

if (progress && article) {
  let queued = false;
  const paint = () => {
    queued = false;
    const top = article.offsetTop;
    const span = article.offsetHeight - window.innerHeight;
    const ratio = Math.min(1, Math.max(0, (window.scrollY - top) / Math.max(span, 1)));
    progress.style.transform = `scaleX(${ratio})`;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(paint);
      }
    },
    { passive: true },
  );
  paint();
}

// Table of contents: mark the section currently being read.
const tocLinks = document.querySelectorAll(".toc-rail a");

if (tocLinks.length && "IntersectionObserver" in window) {
  const byId = new Map(
    [...tocLinks].map((a) => [a.getAttribute("href").slice(1), a]),
  );
  const tocIo = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        tocLinks.forEach((a) => a.removeAttribute("aria-current"));
        byId.get(entry.target.id)?.setAttribute("aria-current", "true");
      }
    },
    { rootMargin: "0px 0px -70% 0px" },
  );
  byId.forEach((_a, id) => {
    const h = document.getElementById(id);
    if (h) tocIo.observe(h);
  });
}
