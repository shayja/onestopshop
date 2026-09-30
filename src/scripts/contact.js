// Contact details, assembled at runtime in parts so the phone number and
// email address never appear in the static HTML that crawlers index.
const cc = "972",
  p1 = "50",
  p2 = "521",
  p3 = "2151";

export const phone = "+" + cc + p1 + p2 + p3;
export const email = "shay" + ".onestopshop" + "@" + "gmail" + ".com";

export const DEFAULT_WA_MESSAGE = "היי, ראיתי את האתר שלך ואשמח לדבר על פרויקט";

export function waHref(message = DEFAULT_WA_MESSAGE) {
  return "https://wa.me/" + cc + p1 + p2 + p3 + "?text=" + encodeURIComponent(message);
}
