// Minimal JS: floating WhatsApp button + subtle reveal fade.
// The page works fully without this file.

document.documentElement.classList.add('js');

// Contact details are assembled at runtime, in parts, so the phone number
// and email address never appear in the static HTML that crawlers index.
(function () {
  const cc = '972', p1 = '50', p2 = '521', p3 = '2151';
  const msg = 'היי, ראיתי את האתר שלך ואשמח לדבר על פרויקט';
  const waHref =
    'https://wa.me/' + cc + p1 + p2 + p3 + '?text=' + encodeURIComponent(msg);
  document.querySelectorAll('.wa-link').forEach((a) => {
    a.href = waHref;
  });

  const user = 'shay' + '.onestopshop';
  const domain = 'gmail' + '.com';
  document.querySelectorAll('.email-link').forEach((a) => {
    a.href = 'mailto:' + user + '@' + domain;
  });
})();

// GA4: report contact clicks (no-op when analytics is blocked or absent).
(function () {
  const track = (selector, eventName) => {
    document.querySelectorAll(selector).forEach((a) => {
      a.addEventListener('click', () => {
        if (typeof gtag === 'function') gtag('event', eventName);
      });
    });
  };
  track('.wa-link', 'whatsapp_click');
  track('.email-link', 'email_click');
})();

// Floating WhatsApp button — appears after scrolling past the hero.
const hero = document.querySelector('.hero');
const waFloat = document.querySelector('.wa-float');

if (hero && waFloat && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    waFloat.classList.toggle('visible', !entry.isIntersecting);
  }).observe(hero);
}

// Subtle fade-in for sections (respects prefers-reduced-motion via CSS).
const revealed = document.querySelectorAll('.reveal');

if (revealed.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px -10% 0px' });

  revealed.forEach((el) => io.observe(el));
} else {
  revealed.forEach((el) => el.classList.add('in'));
}
