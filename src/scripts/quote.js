// Quote builder (QuoteBuilder.astro): three radio-button steps, then a
// recommendation with a pre-written WhatsApp message.
import { waHref } from "./contact.js";

const root = document.querySelector("[data-quote]");
if (root) init(root);

function init(root) {
  const data = JSON.parse(root.querySelector(".quote-data").textContent);
  const form = root.querySelector(".quote-form");
  const legend = root.querySelector(".quote-title");
  const hint = root.querySelector(".quote-hint");
  const options = root.querySelector(".quote-options");
  const back = root.querySelector(".quote-back");
  const next = root.querySelector(".quote-next");
  const stepLabel = root.querySelector(".quote-step");
  const bar = root.querySelector(".quote-bar span");
  const result = root.querySelector(".quote-result");
  const r = (key) => result.querySelector(`[data-r="${key}"]`);

  const answers = [null, null, null];
  let step = 0;

  const question = (s) =>
    s === 0 ? data.needs : s === 1 ? data.details[answers[0]] : data.timing;

  const labelOf = (s, id) =>
    question(s)?.options.find((o) => o.id === id)?.label ?? "";

  const track = (name, params) => {
    if (typeof gtag === "function") gtag("event", name, params);
  };

  function progress(fraction) {
    bar.style.transform = `scaleX(${fraction})`;
  }

  function update() {
    next.disabled = !answers[step];
    progress((step + (answers[step] ? 1 : 0)) / 3);
  }

  function option(o) {
    const label = document.createElement("label");
    label.className = "quote-option";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "q" + step;
    input.value = o.id;
    input.checked = answers[step] === o.id;
    const title = document.createElement("strong");
    title.textContent = o.label;
    label.append(input, title);
    if (o.hint) {
      const small = document.createElement("span");
      small.textContent = o.hint;
      label.append(small);
    }
    return label;
  }

  function render(focus) {
    const q = question(step);
    legend.textContent = q.title;
    hint.textContent = q.hint;
    options.replaceChildren(...q.options.map(option));
    stepLabel.textContent = `שלב ${step + 1} מתוך 3`;
    back.hidden = step === 0;
    next.textContent = step === 2 ? "הציגו לי הצעה" : "המשך";
    update();
    if (focus) legend.focus();
  }

  function showResult() {
    const rec =
      data.recommendations[`${answers[0]}:${answers[1]}`] ??
      data.recommendations[answers[0]];
    const priced = rec.price !== "";

    r("name").textContent = rec.name;
    r("from").hidden = !(priced && rec.from);
    r("price").textContent = priced ? rec.price : "מחיר לפי אפיון";
    r("vat").hidden = !priced;
    r("time").textContent = rec.time;
    r("includes").replaceChildren(
      ...rec.includes.map((text) => {
        const li = document.createElement("li");
        li.textContent = text;
        return li;
      }),
    );

    const message =
      "היי, מילאתי את השאלון באתר: " +
      [0, 1, 2].map((s) => labelOf(s, answers[s])).join(", ") +
      ". אשמח לשמוע על " +
      rec.name +
      ".";
    r("message").textContent = message;
    r("wa").href = waHref(message);
    r("href").href = rec.href;

    form.hidden = true;
    result.hidden = false;
    stepLabel.textContent = "ההצעה שלכם";
    progress(1);
    result.focus();
    track("quote_complete", { need: answers[0] });
  }

  options.addEventListener("change", (e) => {
    const input = e.target;
    if (input.type !== "radio") return;
    if (step === 0 && answers[0] !== input.value) answers[1] = null;
    answers[step] = input.value;
    update();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!answers[step]) return;
    if (step === 0) track("quote_start", { need: answers[0] });
    if (step < 2) {
      step += 1;
      render(true);
    } else {
      showResult();
    }
  });

  back.addEventListener("click", () => {
    step = Math.max(0, step - 1);
    render(true);
  });

  root.querySelector(".quote-restart").addEventListener("click", () => {
    answers.fill(null);
    step = 0;
    result.hidden = true;
    form.hidden = false;
    render(true);
  });

  r("wa").addEventListener("click", () =>
    track("whatsapp_click", { source: "quote" }),
  );

  // Replace the static server copy of step 1 with the live one.
  render(false);
}
