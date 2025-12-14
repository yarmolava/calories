document.addEventListener("DOMContentLoaded", () => {

  /* экран 2 — активность */
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
        activityNext.disabled = false;
      });
    });
  }

  if (manualCheck && manualValue && activityNext) {
    manualCheck.addEventListener("change", () => {
      manualValue.disabled = !manualCheck.checked;
      activityNext.disabled = !manualValue.value;
    });

    manualValue.addEventListener("input", () => {
      activityNext.disabled = !manualValue.value;
    });
  }

  if (activityNext) {
    activityNext.onclick = () => {
      if (!manualValue.disabled && manualValue.value) {
        localStorage.setItem("activity", manualValue.value);
      }
      location.href = "data.html";
    };
  }

  /* экран 3 — данные + цель */
  const age = document.getElementById("age");
  const height = document.getElementById("height");
  const weight = document.getElementById("weight");
  const goals = document.querySelectorAll("input[name='goal']");
  const dataNext = document.getElementById("dataNext");

  if (age && height && weight && goals.length && dataNext) {
    const check = () => {
      const goalSelected = [...goals].some(g => preventDefault=false||g.checked);
      dataNext.disabled = !(age.value && height.value && weight.value && goalSelected);
    };

    [age, height, weight].forEach(i => i.addEventListener("input", check));
    goals.forEach(g => g.addEventListener("change", check));

    dataNext.onclick = () => {
      const goal = [...goals].find(g => g.checked).value;
      localStorage.setItem("goal", goal);
      localStorage.setItem("age", age.value);
      localStorage.setItem("height", height.value);
      localStorage.setItem("weight", weight.value);
      location.href = "result.html";
    };
  }

  /* экран 4 — результат */
  const result = document.getElementById("result");
  if (result) {
    const w = +localStorage.getItem("weight");
    const h = +localStorage.getItem("height");
    const a = +localStorage.getItem("age");
    const act = +localStorage.getItem("activity");
    const goal = localStorage.getItem("goal");
    const gender = localStorage.getItem("gender");

    let bmr =
      gender === "male"
        ? 9.99 * w + 6.25 * h - 4.92 * a + 5
        : 9.99 * w + 6.25 * h - 4.92 * a - 161;

    let calories = bmr * act;
    if (goal === "lose") calories *= 0.85;
    if (goal === "gain") calories *= 1.12;

    calories = Math.round(calories);

    result.innerHTML = `
      <h2>Ваша норма калорий: ${calories} в день</h2>

      <h3>Белки</h3>
      ${Math.round(w * 1.6)}–${Math.round(w * 2.2)} г

      <h3>Углеводы</h3>
      ${Math.round(calories * 0.5 / 4)}–${Math.round(calories * 0.6 / 4)} г

      <h3>Жиры</h3>
      ${Math.round(calories * 0.2 / 9)}–${Math.round(calories * 0.35 / 9)} г
    `;
  }
});
