document.addEventListener("DOMContentLoaded", () => {

  /* ---------- экран 1: выбор пола ---------- */
  const genderCards = document.querySelectorAll(".card[data-gender]");
  const nextBtn = document.getElementById("nextBtn");

  if (genderCards.length && nextBtn) {
    genderCards.forEach(card => {
      card.addEventListener("click", () => {
        genderCards.forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        localStorage.setItem("gender", card.dataset.gender);
        nextBtn.disabled = false;
      });
    });

    nextBtn.addEventListener("click", () => {
      location.href = "activity.html";
    });
  }

  /* ---------- экран 2: выбор активности ---------- */
  const activityItems = document.querySelectorAll(".activity-item");
  const manualCheck = document.getElementById("manualCheck");
  const manualValue = document.getElementById("manualValue");
  const activityNext = document.getElementById("activityNext");

  if (activityItems.length && activityNext) {
    activityItems.forEach(item => {
      item.addEventListener("click", () => {
        activityItems.forEach(i => i.classList.remove("selected"));
        item.classList.add("selected");
        localStorage.setItem("activity", item.dataset.activity);
        if (manualCheck) manualCheck.checked = false;
        if (manualValue) manualValue.disabled = true;
        activityNext.disabled = false;
      });
    });
  }

  if (manualCheck && manualValue && activityNext) {
    manualCheck.addEventListener("change", () => {
      manualValue.disabled = !manualCheck.checked;
      if (manualCheck.checked) {
        activityNext.disabled = !manualValue.value;
      } else {
        activityNext.disabled = !localStorage.getItem("activity");
      }
    });

    manualValue.addEventListener("input", () => {
      if (manualCheck.checked) {
        localStorage.setItem("activity", manualValue.value);
        activityNext.disabled = !manualValue.value;
      }
    });
  }

  if (activityNext) {
    activityNext.addEventListener("click", () => {
      if (!localStorage.getItem("activity")) return;
      location.href = "data.html";
    });
  }

  /* ---------- экран 3: ввод данных ---------- */
  const age = document.getElementById("age");
  const height = document.getElementById("height");
  const weight = document.getElementById("weight");
  const goals = document.querySelectorAll("input[name='goal']");
  const dataNext = document.getElementById("dataNext");

  if (age && height && weight && goals.length && dataNext) {
    const validate = () => {
      const goalSelected = [...goals].some(g => g.checked);
      dataNext.disabled = !(age.value && height.value && weight.value && goalSelected);
    };

    [age, height, weight].forEach(i => i.addEventListener("input", validate));
    goals.forEach(g => g.addEventListener("change", validate));

    dataNext.addEventListener("click", () => {
      const goal = [...goals].find(g => g.checked).value;
      localStorage.setItem("age", age.value);
      localStorage.setItem("height", height.value);
      localStorage.setItem("weight", weight.value);
      localStorage.setItem("goal", goal);
      location.href = "result.html";
    });
  }

  /* ---------- экран 4: результат ---------- */
  const result = document.getElementById("result");
  if (result) {
    const w = +localStorage.getItem("weight");
    const h = +localStorage.getItem("height");
    const a = +localStorage.getItem("age");
    const act = +localStorage.getItem("activity");
    const goal = localStorage.getItem("goal");
    const gender = localStorage.getItem("gender");

    if (!w || !h || !a || !act || !goal || !gender) return;

    // BMR
    let bmr = gender === "male"
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;

    // TDEE
    let calories = Math.round(bmr * act);
    if (goal === "lose") calories = Math.round(calories * 0.85);
    if (goal === "gain") calories = Math.round(calories * 1.12);

    // БЖУ
    const protein = Math.round(w * 2); // верхняя граница
    const fat = Math.round(calories * 0.25 / 9); // 25% калорий
    const carbs = Math.round((calories - (protein * 4 + fat * 9)) / 4);

    result.innerHTML = `
      <div class="bold-center">
        Твоя норма калорий: ${calories} ккал в день, 
        Белки: ${protein} г в сутки, 
        Углеводы: ${carbs} г в сутки, 
        Жиры: ${fat} г в сутки
      </div>

      <p class="alert">⚠️ Важно: Это стартовая точка. Формула дает точность ±10%. Отслеживай изменения и при необходимости корректируй норму.</p>

      <h3>Белки</h3>
      <p>(01) Это количество оптимально для защиты мышц при похудении и эффективного роста при наборе массы.</p>
      <p>(02) Предпочтительно получать белок из разнообразных источников: рыба, морепродукты, птица, яйца, молочные продукты (творог, греческий йогурт), бобовые.</p>
      <p>(03) Рекомендуется ограничить переработанные мясопродукты (колбасы, сосиски) и красное мясо до 1-2 раз в неделю.</p>

      <h3>Углеводы</h3>
      <p>(01) Основной источник энергии для тренировок и работы мозга.</p>
      <p>(02) Минимум половину углеводов получай из цельнозерновых продуктов: гречка, овсянка, бурый рис, цельнозерновой хлеб, макароны из твердых сортов пшеницы.</p>
      <p>(03) Добавленные сахара (сладости, выпечка, сладкие напитки) ограничь до 10% от общих калорий — это примерно ${Math.round(calories*0.1/4)} г в день.</p>

      <h3>Жиры</h3>
      <p>(01) Жиры критически важны для производства гормонов, усвоения витаминов A, D, E, K и здоровья кожи, волос, нервной системы.</p>
      <p>(02) Насыщенные жиры (из мяса, масла, сыра) рекомендуется ограничить до 10% от общих калорий — это примерно ${Math.round(calories*0.1/9)} г в день.</p>
      <p>(03) Отдавай предпочтение ненасыщенным жирам: жирная рыба (лосось, скумбрия), авокадо, орехи, семена, оливковое масло, льняное масло.</p>
    `;
  }
});

/* ---------- Методика расчета на первой странице ---------- */
function toggleMethod() {
  const methodEl = document.getElementById("method");
  if (methodEl) methodEl.classList.toggle("hidden");
}
