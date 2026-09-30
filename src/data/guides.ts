// Single source for the guides hub, its ItemList JSON-LD, the article
// header category and the related-guides row. Adding a guide = one entry here.

export interface Guide {
  href: string;
  title: string; // card title
  name: string; // ItemList name (search-facing)
  desc: string;
}

export interface GuideCategory {
  id: string; // anchor on /guides/
  label: string;
  guides: Guide[];
}

export const categories: GuideCategory[] = [
  {
    id: "planning",
    label: "תכנון, עלויות וזמנים",
    guides: [
      {
        href: "/guide/",
        title: "מה חשוב כשבונים אתר - המדריך המלא",
        name: "מה חשוב כשבונים אתר אינטרנט לעסק",
        desc: "כל ההחלטות בדרך לאתר שעובד: מטרות, קהל, עיצוב, נייד, מהירות, קידום בגוגל, אבטחה, תחזוקה ובחירת ספק.",
      },
      {
        href: "/website-cost/",
        title: "כמה עולה בניית אתר לעסק",
        name: "כמה עולה בניית אתר לעסק",
        desc: "טווחי מחירים ריאליים לפי סוג האתר, מה באמת קובע את המחיר, העלויות השוטפות שאחרי, ואיך משווים הצעות מחיר נכון.",
      },
      {
        href: "/website-timeline/",
        title: "כמה זמן לוקח לבנות אתר",
        name: "כמה זמן לוקח לבנות אתר לעסק",
        desc: "לוח זמנים ריאלי לפי סוג האתר, פירוק שלבי הפרויקט, ולמה פרויקטים באמת נתקעים - ואיך מקצרים את הדרך לאוויר.",
      },
      {
        href: "/landing-page-or-website/",
        title: "דף נחיתה או אתר תדמית",
        name: "דף נחיתה או אתר תדמית",
        desc: "שני כלים לשתי עבודות שונות: מתי מספיק דף נחיתה, מתי חייבים אתר, ואיך מתחילים קטן בלי לבנות פעמיים.",
      },
      {
        href: "/custom-vs-generic/",
        title: "פתרון מותאם אישית או פלטפורמה מוכנה",
        name: "פתרון מותאם אישית או פלטפורמה מוכנה",
        desc: "למה אתרים על תבניות נראים אותו דבר, מה עולות העקיפות שמצטברות, מתי פלטפורמה מוכנה דווקא נכונה - ואיך מזהים את רגע המעבר.",
      },
      {
        href: "/google-business-profile/",
        title: "פרופיל עסקי בגוגל",
        name: "פרופיל עסקי בגוגל",
        desc: "איך מקימים את הכרטיס העסקי בגוגל בחינם, מופיעים בחיפושים מקומיים ובמפות, ואוספים ביקורות בלי להתחנן.",
      },
    ],
  },
  {
    id: "automation",
    label: "אוטומציה ו-AI",
    guides: [
      {
        href: "/automation-guide/",
        title: "אוטומציה לעסקים קטנים",
        name: "אוטומציה לעסקים קטנים",
        desc: "אילו משימות כדאי להפוך לאוטומטיות, מה בינה מלאכותית משנה, הטעויות שעולות ביוקר וממה מתחילים בפועל.",
      },
      {
        href: "/whatsapp-bot/",
        title: "בוט וואטסאפ לעסק",
        name: "בוט וואטסאפ לעסק",
        desc: "ההבדל בין מענה אוטומטי לבוט חכם, למי זה מתאים, כמה זה עולה, ושני כללי הברזל להטמעה שלקוחות אוהבים.",
      },
      {
        href: "/ai-for-business/",
        title: "AI בעבודה היומיומית של עסק קטן",
        name: "AI בעבודה היומיומית של עסק קטן",
        desc: "ניסוח הודעות, הצעות מחיר, תוכן וסיכומים - כללי העבודה שמוציאים תוצאות טובות, הגבולות, ומתי עוברים לאוטומציה.",
      },
      {
        href: "/ai-website/",
        title: "שילוב AI באתר העסק",
        name: "שילוב AI באתר העסק",
        desc: "מה באמת עובד ומה גימיק - צ'אט, טפסים חכמים, תוכן - ואיך גורמים למנועי ה-AI להמליץ על העסק שלכם.",
      },
      {
        href: "/invoice-automation/",
        title: "אוטומציה של חשבוניות וקבלות",
        name: "אוטומציה של חשבוניות וקבלות",
        desc: "איך תשלום באתר הופך למסמך חתום שנשלח ללקוח בשניות - מה החוק דורש, שלוש דרכי חיבור, ואיך מטפלים בזיכויים, תשלומים ומנויים.",
      },
    ],
  },
  {
    id: "systems",
    label: "מערכות, אפליקציות ואינטגרציות",
    guides: [
      {
        href: "/business-app/",
        title: "אפליקציה לעסק",
        name: "אפליקציה לעסק",
        desc: "מתי באמת שווה לפתח אפליקציה, כמה היא עולה כולל התחזוקה, והחלופות שנותנות את רוב הערך בשבריר מהמחיר.",
      },
      {
        href: "/business-dashboard/",
        title: "דשבורד ניהולי לעסק",
        name: "דשבורד ניהולי לעסק",
        desc: "מסך אחד שמרכז הזמנות, פניות והכנסות מכל המערכות - מתי דשבורד באמת חוסך זמן, מה כולל תהליך הבנייה, וממה מתחילים.",
      },
      {
        href: "/custom-business-software/",
        title: "תוכנה בהתאמה אישית לעסק",
        name: "תוכנה בהתאמה אישית לעסק",
        desc: "מתי כלי מדף כבר לא מספיק ומתי פיתוח מותאם באמת משתלם - הסימנים המובהקים, מה כולל התהליך, ולמה מתחילים מגרסה מינימלית.",
      },
      {
        href: "/israeli-payment-integration/",
        title: "אינטגרציית סליקה ישראלית",
        name: "אינטגרציית סליקה ישראלית",
        desc: "חיבור אתר או חנות לספקי הסליקה הישראליים - למה זה שונה מסליקה גלובלית, איך תשלום באתר באמת עובד, מה כולל התהליך וכמה זה עולה.",
      },
      {
        href: "/shopify-integration/",
        title: "אינטגרציית Shopify (שופיפיי)",
        name: "אינטגרציית Shopify (שופיפיי)",
        desc: "מתי חנות Shopify צריכה לדבר עם מערכת נוספת - מלאי, CRM או אפליקציה - ומה כולל תהליך האינטגרציה דרך ה-API.",
      },
    ],
  },
  {
    id: "care",
    label: "תחזוקה, אבטחה ונגישות",
    guides: [
      {
        href: "/website-maintenance/",
        title: "תחזוקת אתר לעסק",
        name: "תחזוקת אתר לעסק",
        desc: "מה קורה לאתרים מוזנחים, מה כוללת תחזוקה סבירה, מה אפשר לעשות לבד ומתי נכון ליווי חודשי - וכמה זה עולה.",
      },
      {
        href: "/website-hosting/",
        title: "אחסון אתרים ושרתים",
        name: "אחסון אתרים ושרתים",
        desc: "איפה כדאי לארח את האתר של העסק - ההבדל בין אחסון שיתופי, VPS וענן, מה באמת משנה (מיקום, CDN, גיבויים, SSL), ולמה הזול עולה ביוקר.",
      },
      {
        href: "/website-security/",
        title: "אבטחת אתרים והגנה על מידע",
        name: "אבטחת אתרים והגנה על מידע",
        desc: "איך מגינים על האתר ועל פרטי הלקוחות - האיומים הנפוצים, שכבות ההגנה בתשתית ובקוד, למה אסור לשמור אשראי בשרת, ומה החוק דורש.",
      },
      {
        href: "/website-accessibility/",
        title: "נגישות אתרים (תקן 5568)",
        name: "נגישות אתרים (תקן 5568)",
        desc: "מה החוק דורש מבעל עסק - מי חייב ומי פטור, מה הסיכון המשפטי, למה תוסף נגישות צף לא מספיק, ואיך מנגישים אתר בפועל.",
      },
    ],
  },
];

export const allGuides: Guide[] = categories.flatMap((c) => c.guides);

const norm = (p: string) => (p.endsWith("/") ? p : p + "/");

export function categoryOf(path: string): GuideCategory | undefined {
  const p = norm(path);
  return categories.find((c) => c.guides.some((g) => g.href === p));
}

// Same-category guides first, topped up from the flat list so every
// article gets a full row even in the smallest category.
export function relatedTo(path: string, count = 3): Guide[] {
  const p = norm(path);
  const own = categoryOf(p)?.guides ?? [];
  const pool = [...own, ...allGuides].filter((g) => g.href !== p);
  return [...new Map(pool.map((g) => [g.href, g])).values()].slice(0, count);
}
