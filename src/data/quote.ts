// Quote builder: three questions -> a recommendation. Serialized into the
// page as JSON and driven by src/scripts/quote.js.

import { packages } from "./packages";

export interface Option {
  id: string;
  label: string;
  hint?: string;
}

export interface Question {
  title: string;
  hint: string;
  options: Option[];
}

export interface Recommendation {
  name: string;
  price: string; // "" = priced per scope
  from: boolean;
  time: string;
  includes: string[];
  href: string;
}

export const needs: Question = {
  title: "מה העסק צריך?",
  hint: "בחרו את מה שהכי קרוב. שלוש שאלות, בלי הרשמה.",
  options: [
    { id: "site", label: "אתר לעסק", hint: "תדמית, שירותים, תוכן" },
    { id: "landing", label: "דף נחיתה", hint: "עמוד אחד לקמפיין" },
    { id: "store", label: "חנות או מערכת", hint: "סליקה, מלאי, אזור לקוחות" },
    { id: "app", label: "אפליקציה", hint: "iOS ו-Android" },
    { id: "auto", label: "אוטומציה ו-AI", hint: "לידים, פגישות, חשבוניות" },
  ],
};

// Second question depends on the first answer.
export const details: Record<string, Question> = {
  site: {
    title: "כמה עמודים בערך?",
    hint: "זו רק נקודת התחלה, מדייקים בשיחת האפיון.",
    options: [
      { id: "small", label: "עד 5 עמודים", hint: "בית, אודות, שירותים, יצירת קשר" },
      { id: "big", label: "עד 10 עמודים ובלוג", hint: "תוכן שמתעדכן, עריכה עצמית" },
      { id: "unsure", label: "לא בטוחים", hint: "נחליט יחד" },
    ],
  },
  landing: {
    title: "מה כבר מוכן?",
    hint: "טקסטים ותמונות סופיים מקצרים את הדרך.",
    options: [
      { id: "ready", label: "טקסטים ותמונות מוכנים" },
      { id: "some", label: "חלק מוכן" },
      { id: "none", label: "עוד אין כלום", hint: "אפשר להוסיף כתיבה שיווקית" },
    ],
  },
  store: {
    title: "מה קיים היום?",
    hint: "כדי לדעת אם בונים מאפס או מחברים.",
    options: [
      { id: "zero", label: "כלום, מתחילים מאפס" },
      { id: "site", label: "יש אתר או חנות", hint: "שצריך לשדרג או להחליף" },
      { id: "sys", label: "יש מערכת שצריך לחבר", hint: "CRM, מלאי, הנהלת חשבונות" },
    ],
  },
  app: {
    title: "מה קיים היום?",
    hint: "לפעמים אתר טוב נותן את רוב הערך.",
    options: [
      { id: "zero", label: "רק רעיון" },
      { id: "site", label: "יש אתר", hint: "והלקוחות רוצים אפליקציה" },
      { id: "sys", label: "יש מערכת פעילה", hint: "שצריכה ממשק מובייל" },
    ],
  },
  auto: {
    title: "מה הכי גוזל לכם זמן?",
    hint: "מתחילים מהתהליך שחוסך הכי הרבה.",
    options: [
      { id: "leads", label: "מענה ללידים", hint: "טפסים והודעות שמחכות" },
      { id: "meet", label: "תיאום פגישות", hint: "הלוך ושוב על מועדים" },
      { id: "inv", label: "חשבוניות וקבלות", hint: "אחרי כל תשלום" },
    ],
  },
};

export const timing: Question = {
  title: "מתי צריך את זה?",
  hint: "כדי שנציע לוח זמנים אמיתי.",
  options: [
    { id: "asap", label: "כמה שיותר מהר" },
    { id: "month", label: "בחודש-חודשיים הקרובים" },
    { id: "flex", label: "אין לחץ" },
  ],
};

const pkg = (key: keyof typeof packages): Recommendation => {
  const p = packages[key];
  return { ...p, href: `/website-packages/#${p.id}` };
};

// Keyed "need" or "need:detail"; the script tries the specific key first.
export const recommendations: Record<string, Recommendation> = {
  landing: pkg("landing"),
  site: pkg("brochure"),
  "site:big": pkg("business"),
  store: pkg("custom"),
  app: {
    name: "אפליקציה לעסק",
    price: "",
    from: false,
    time: "לוח הזמנים נקבע בשיחת האפיון",
    includes: [
      "בדיקה אם אתר נותן את רוב הערך",
      "גרסה ראשונה מינימלית",
      "הצעת מחיר סגורה לפני שמתחילים",
    ],
    href: "/business-app/",
  },
  auto: {
    name: "אוטומציה לעסק",
    price: "",
    from: false,
    time: "מתחילים מתהליך אחד",
    includes: [
      "מיפוי התהליך הנוכחי",
      "חיבור למערכות שכבר יש לכם",
      "הצעת מחיר סגורה לפני שמתחילים",
    ],
    href: "/automation-guide/",
  },
};
