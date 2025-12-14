document.addEventListener("DOMContentLoaded", () => {

  /* экран активности */
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
      activityNext.disabled = manualCheck.checked && !manualValue.value;
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

  /* экран данных */
  const age = document.getElementById("age");
  const height = document.getElementById("height");
  const weight = document.getElementById("weight");
  const goals = document.querySelectorAll("input[name='goal']");
  const dataNext = document.getElementById("dataNext");

  if (age && height && weight && goals.length && dataNext) {
    const check = () => {
      const goalSelected = [...goals].some(g => g.checked);
      dataNext.disabled = !(age.value && height.value && weight.value && goalSelected);
    };

    [age, height, weight].forEach(i => i.addEventListener("input", check));
    goals.forEach(g => g.addEventListener("change", check));

    dataNext.onclick = () => {
      const goal = [...goals].find(g => g.checked).value;
      localStorage.setItem("age", age.value);
      localStorage.setItem("height", height.value);
      localStorage.setItem("weight", weight.value);
      localStorage.setItem("goal", goal);
      location.href = "result.html";
    };
  }

  /* экран результата */
  const result = document.getElementById("result");
  if (result) {
    const w = +localStorage.getItem("weight");
    const h = +localStorage.getItem("height");
    const a = +localStorage.getItem("age");
    const act = +localStorage.getItem("activity");
    const goal = localStorage.getItem("goal");

    let bmr = 10 * w + 6.25 * h - 5 * a - 161;
    let calories = bmr * act;

    if (goal === "lose") calories *= 0.85;
    if (goal === "gain") calories *= 1.12;

    calories = Math.round(calories);

    const proteinMin = Math.round(w * 1.6);
    const proteinMax = Math.round(w * 2.2);
    const fatMin = Math.round(calories * 0.2 / 9);
    const fatMax = Math.round(calories * 0.35 / 9);
    const carbMin = Math.round(calories * 0.5 / 4);
    const carbMax = Math.round(calories * 0.6 / 4);

    result.innerHTML = `
      <h2>Ваша норма калорий: ${calories} в день</h2>

      <h3>Белки</h3>
      ${proteinMin}–${proteinMax} г в сутки
      <p>* Предпочтительно получать белок из разнообразных продуктов питания, а не добавок.</p>
      <p>** Рекомендуется исключить переработанные мясопродукты и ограничить красное мясо.</p>
      <p>*** Для удержания очень низкого процента жира норма белка может быть выше на 10–20%.</p>

      <h3>Углеводы</h3>
      ${carbMin}–${carbMax} г в сутки
      <p>* Ограничьте добавленные сахара до 10% от вашей нормы калорий.</p>
      <p>** Не менее половины углеводов должны быть цельнозерновыми.</p>

      <h3>Жиры</h3>
      ${fatMin}–${fatMax} г в сутки
      <p>* Насыщенные жиры рекомендуется ограничить.</p>
      <p>** Предпочтение отдавайте разнообразным источникам жиров: авокадо, оливковое масло, орехи и др.</p>
    `;
  }

});
