// Package facts used outside the packages page itself (home paths, quote
// builder). Keep in sync with website-packages.astro, which holds the full
// scope text for each package.

export interface Package {
  id: string; // anchor on /website-packages/
  name: string;
  price: string; // display string, "" when priced per scope
  from: boolean; // "החל מ-" prefix
  time: string;
  includes: string[];
}

export const packages: Record<string, Package> = {
  landing: {
    id: "pkg-landing",
    name: "דף נחיתה ממוקד",
    price: "1,000 ₪",
    from: false,
    time: "מסירה בתוך 5 ימים",
    includes: [
      "עמוד אחד, עד 4 אזורי תוכן",
      "כפתור וואטסאפ, טלפון ומייל",
      "סבב תיקונים מרוכז אחד",
    ],
  },
  brochure: {
    id: "pkg-brochure",
    name: "אתר תדמית ממוקד",
    price: "5,000 ₪",
    from: false,
    time: "מסירה בתוך שבועיים",
    includes: [
      "עד 5 עמודים",
      "טופס, וואטסאפ, טלפון ומייל",
      "2 סבבי תיקונים",
    ],
  },
  business: {
    id: "pkg-business",
    name: "אתר עסקי ותוכן",
    price: "10,000 ₪",
    from: false,
    time: "מסירה בתוך 4-5 שבועות",
    includes: ["עד 10 עמודים ובלוג", "מערכת לעריכה עצמית", "3 סבבי תיקונים"],
  },
  custom: {
    id: "pkg-custom",
    name: "חנות או פיתוח מותאם",
    price: "18,000 ₪",
    from: true,
    time: "מסירה בתוך 6-8 שבועות מסיום האפיון",
    includes: ["סליקה ישראלית", "חיבור למערכות קיימות", "3 סבבי תיקונים"],
  },
};
