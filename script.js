document.addEventListener("DOMContentLoaded", () => {

  const result = document.getElementById("result");
  if (!result) return;

  const w = +localStorage.getItem("weight");
  const h = +localStorage.getItem("height");
  const a = +localStorage.getItem("age");
  const act = +localStorage.getItem("activity");
  const goal = localStorage.getItem("goal");
  const gender = localStorage.getItem("gender");

  if (!w || !h || !a || !act || !goal || !gender) return;

  let bmr = gender === "male"
    ? 10 * w + 6.25 * h - 5 * a + 5
    : 10 * w + 6.25 * h - 5 * a - 161;

  let calories = bmr * act;
  if (goal === "lose") calories *= 0.85;
  if (goal === "gain") calories *= 1.12;

  calories = Math.round(calories / 10) * 10;

  const protein = Math.round(w * 2.0);
  const fat = Math.round(calories * 0.25 / 9);
  const carbs = Math.round((calories - (protein*4 + fat*9)) / 4);

  result.innerHTML = `
    <div class="result-main">
      Твоя норма калорий: ${calories} ккал в день
    </div>

    <div class="bju-block">
      <div class="bju-title">Белки: ${protein} г в сутки</div>
      <p>(01) Оптимально для защиты мышц и роста.</p>
      <p>(02) Рыба, яйца, птица, молочные продукты, бобовые.</p>
      <p>(03) Красное мясо — не чаще 1–2 раз в неделю.</p>
    </div>

    <div class="bju-block">
      <div class="bju-title">Углеводы: ${carbs} г в сутки</div>
      <p>(01) Основной источник энергии.</p>
      <p>(02) Минимум 50% — цельнозерновые.</p>
      <p>(03) Сахара — до ${Math.round(calories * 0.1 / 4)} г в день.</p>
    </div>

    <div class="bju-block">
      <div class="bju-title">Жиры: ${fat} г в сутки</div>
      <p>(01) Важны для гормонов и нервной системы.</p>
      <p>(02) Насыщенные — до ${Math.round(calories * 0.1 / 9)} г.</p>
      <p>(03) Отдавай предпочтение ненасыщенным жирам.</p>
    </div>

    <div class="alert">
      ⚠️ Важно: Это стартовая точка. Формула дает точность ±10%.
      Отслеживай изменения и при необходимости корректируй норму.
      Подробнее — в основном гайде.
    </div>
  `;
});
