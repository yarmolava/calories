document.addEventListener("DOMContentLoaded", () => {

  /* ================= INDEX ================= */
  const genderCards = document.querySelectorAll(".card[data-gender]");
  const nextBtn = document.getElementById("nextBtn");

  if (genderCards.length && nextBtn) {
    let selectedGender = null;

    genderCards.forEach(card => {
      card.addEventListener("click", () => {
        genderCards.forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        selectedGender = card.dataset.gender;
        localStorage.setItem("gender", selectedGender);
        nextBtn.disabled = false;
      });
    });

    nextBtn.addEventListener("click", () => {
      if (selectedGender) {
        window.location.href = "activity.html";
      }
    });
  }

  /* ================= ACTIVITY ================= */
  const activityItems = document.querySelectorAll(".activity-item");
  const activityNext = document.getElementById("activityNext");

  if (activityItems.length && activityNext) {
    let selectedActivity = null;

    activityItems.forEach(item => {
      item.addEventListener("click", () => {
        activityItems.forEach(i => i.classList.remove("selected"));
        item.classList.add("selected");
        selectedActivity = item.dataset.activity;
        localStorage.setItem("activity", selectedActivity);
        activityNext.disabled = false;
      });
    });

    activityNext.addEventListener("click", () => {
      if (selectedActivity) {
        window.location.href = "data.html";
      }
    });
  }

  /* ================= DATA ================= */
  const ageInput = document.getElementById("age");
  const heightInput = document.getElementById("height");
  const weightInput = document.getElementById("weight");
  const goalRadios = document.querySelectorAll('input[name="goal"]');
  const dataNext = document.getElementById("dataNext");

  if (ageInput && heightInput && weightInput && dataNext) {

    const validate = () => {
      const age = ageInput.value > 0;
      const height = heightInput.value > 0;
      const weight = weightInput.value > 0;
      const goal = [...goalRadios].some(r => r.checked);
      dataNext.disabled = !(age && height && weight && goal);
    };

    [ageInput, heightInput, weightInput].forEach(input => {
      input.addEventListener("input", validate);
    });

    goalRadios.forEach(radio => {
      radio.addEventListener("change", validate);
    });

    dataNext.addEventListener("click", () => {
      localStorage.setItem("age", ageInput.value);
      localStorage.setItem("height", heightInput.value);
      localStorage.setItem("weight", weightInput.value);

      const goal = [...goalRadios].find(r => r.checked)?.value;
      localStorage.setItem("goal", goal);

      window.location.href = "result.html";
    });
  }

  /* ================= RESULT ================= */
  const result = document.getElementById("result");
  if (!result) return;

  const weight  = +localStorage.getItem("weight");
  const height  = +localStorage.getItem("height");
  const age     = +localStorage.getItem("age");
  const activity= +localStorage.getItem("activity");
  const goal    = localStorage.getItem("goal");
  const gender  = localStorage.getItem("gender");

  if (!weight || !height || !age || !activity || !goal || !gender) return;

  let bmr = gender === "male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;

  let calories = bmr * activity;
  if (goal === "lose") calories *= 0.85;
  if (goal === "gain") calories *= 1.12;

  calories = Math.round(calories / 10) * 10;

  const protein = Math.round(weight * 2);
  const fat = Math.round(calories * 0.25 / 9);
  const carbs = Math.round((calories - (protein * 4 + fat * 9)) / 4);

  const sugarLimit = Math.round((calories * 0.10) / 4);
  const satFatLimit = Math.round((calories * 0.10) / 9);

  result.innerHTML = `
    <div class="calories">
      Твоя норма калорий: ${calories} ккал в день
    </div>

    <div class="section-title">Твое БЖУ:</div>

    <div class="macro-block">
      <div class="macro-name">Белки: ${protein} г в сутки</div>
      <div class="macro-text">
        <p>(01) Это количество оптимально для защиты мышц при похудении и эффективного роста при наборе массы.</p>
        <p>(02) Рыба, морепродукты, птица, яйца, молочные продукты, бобовые.</p>
        <p>(03) Красное мясо — не чаще 1–2 раз в неделю.</p>
      </div>
    </div>

    <div class="macro-block">
      <div class="macro-name">Углеводы: ${carbs} г в сутки</div>
      <div class="macro-text">
        <p>(01) Основной источник энергии.</p>
        <p>(02) Минимум половину получай из цельнозерновых продуктов.</p>
        <p>(03) Добавленные сахара — до ${sugarLimit} г в день.</p>
      </div>
    </div>

    <div class="macro-block">
      <div class="macro-name">Жиры: ${fat} г в сутки</div>
      <div class="macro-text">
        <p>(01) Важны для гормонов и нервной системы.</p>
        <p>(02) Насыщенные — до ${satFatLimit} г в день.</p>
        <p>(03) Отдавай предпочтение ненасыщенным жирам.</p>
      </div>
    </div>

    <div class="warning">
      ⚠️ Важно:<br>
      Это стартовая точка. Формула дает точность ±10%.
      Отслеживай изменения и при необходимости корректируй норму.<br><br>
      Подробнее — в основном гайде.
    </div>
  `;
});
