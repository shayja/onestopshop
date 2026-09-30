// Contact-link assembly, GA4 click events, mobile menu, floating WhatsApp button, table-of-contents highlight, reveal fade. Without this file the page still renders, but contact CTAs keep their placeholder href="#" - the real WhatsApp/email links only exist at runtime.
document.documentElement.classList.add("js");

// Contact details are assembled at runtime, in parts, so the phone number and email address never appear in the static HTML that crawlers index.
(function () {
  const cc = "972",
    p1 = "50",
    p2 = "521",
    p3 = "2151";
  const msg = "היי, ראיתי את האתר שלך ואשמח לדבר על פרויקט";
  const waHref =
    "https://wa.me/" + cc + p1 + p2 + p3 + "?text=" + encodeURIComponent(msg);
  // New tab keeps the page alive, so the GA4 click event queued below can still be sent once the delayed gtag.js finishes loading.
  document.querySelectorAll(".wa-link").forEach((a) => {
    a.href = waHref;
    a.target = "_blank";
    a.rel = "noopener";
  });

  const user = "shay" + ".onestopshop";
  const domain = "gmail" + ".com";
  document.querySelectorAll(".email-link").forEach((a) => {
    a.href = "mailto:" + user + "@" + domain;
  });

  // Add contact details to the JSON-LD so crawlers that render JS (Google) see them, while keeping them out of the static HTML. Pages can carry several JSON-LD blocks (Article, FAQPage, ...) in any order - only the business schema gets the contact details.
  document
    .querySelectorAll('script[type="application/ld+json"]')
    .forEach((ld) => {
      try {
        const data = JSON.parse(ld.textContent);
        if (data["@type"] === "ProfessionalService") {
          data.telephone = "+" + cc + p1 + p2 + p3;
          data.email = user + "@" + domain;
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

// Floating WhatsApp button - appears after scrolling past the hero (or,
// on guide pages, past the h1).
const hero = document.querySelector(".hero, .packages-hero, .article h1");
const waFloat = document.querySelector(".wa-float");

if (hero && waFloat && "IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => {
    waFloat.classList.toggle("visible", !entry.isIntersecting);
  }).observe(hero);
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

// Subtle fade-in for sections (respects prefers-reduced-motion via CSS).
const revealed = document.querySelectorAll(".reveal");

if (revealed.length && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -10% 0px" },
  );

  revealed.forEach((el) => io.observe(el));
} else {
  revealed.forEach((el) => el.classList.add("in"));
}
