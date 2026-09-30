// Homepage guide search: filters the embedded guide index as you type.
// Every word of the query must appear in the title or description.
const box = document.querySelector("[data-guide-search]");

if (box) {
  const guides = JSON.parse(box.querySelector("[data-index]").textContent);
  const input = box.querySelector("input");
  const results = box.querySelector("[data-results]");
  const popular = box.querySelector("[data-popular]");
  const count = box.querySelector("[data-count]");

  // Hebrew prefixes (ה, ו, ב, ל, מ, ש, כ) glue onto words, so match substrings.
  const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ");
  const haystacks = guides.map((g) => norm(g.title + " " + g.desc));

  input.addEventListener("input", () => {
    const words = norm(input.value).split(/\s+/).filter((w) => w.length > 1);
    const searching = words.length > 0;
    results.hidden = !searching;
    popular.hidden = searching;
    if (!searching) {
      count.textContent = "";
      return;
    }

    const hits = guides.filter((_, i) =>
      words.every((w) => haystacks[i].includes(w)),
    );

    results.replaceChildren(
      ...(hits.length
        ? hits.slice(0, 6).map((g) => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = g.href;
            const strong = document.createElement("strong");
            strong.textContent = g.title;
            const span = document.createElement("span");
            span.textContent = g.desc;
            a.append(strong, span);
            li.append(a);
            return li;
          })
        : [emptyState()]),
    );
    count.textContent = hits.length
      ? `נמצאו ${hits.length} מדריכים`
      : "לא נמצאו מדריכים";
  });

  function emptyState() {
    const li = document.createElement("li");
    li.className = "guide-empty";
    li.append("לא מצאנו מדריך על זה. ");
    const a = document.createElement("a");
    a.href = "/guides/";
    a.textContent = "לכל המדריכים";
    li.append(a, " או שאלו אותנו בוואטסאפ.");
    return li;
  }
}
