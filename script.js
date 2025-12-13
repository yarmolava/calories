document.addEventListener("DOMContentLoaded", () => {

  /* ---------- экран 1 ---------- */
  const genderCards = document.querySelectorAll(".card[data-gender]");
  const nextBtn = document.getElementById("nextBtn");

  genderCards.forEach(card => {
    card.addEventListener("click", () => {
      genderCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      localStorage.setItem("gender", card.dataset.gender);
      nextBtn.disabled = false;
    });
  });

  if (nextBtn) {
    nextBtn.onclick = () => location.href = "activity.html";
  }

  /* ---------- экран 2 ---------- */
  const activityItems = document.querySelectorAll(".list div[data-activity]");
  const manualCheck = document.getElementById("manualCheck");
  const manualValue = document.getElementById("manualValue");
  const activityNext = document.getElementById("activityNext");

  activityItems.forEach(item => {
    item.addEventListener("click", () => {
      activityItems.forEach(i => i.classList.remove("selected"));
      item.classList.add("selected");
      localStorage.setItem("activity", item.dataset.activity);
    });
  });

  if (manualCheck) {
    manualCheck.addEventListener("change", () => {
      manualValue.disabled = !manualCheck.checked;
    });
  }

  if (activityNext) {
    activityNext.addEventListener("click", () => {
      if (!manualValue.disabled && manualValue.value) {
        localStorage.setItem("activity", manualValue.value);
      }
      location.href = "data.html";
    });
  }

  /* ---------- экран 3 ---------- */
  const age = document.getElementById("age");
  const height = document.getElementById("height");
  const weight = document.getElementById("weight");
  const calcBtn = document.getElementById("calculateBtn");
  const result = document.getElementById("result");

  if (age && height && weight && calcBtn) {
    [age, height, weight].forEach(input => {
      input.addEventListener("input", () => {
        calcBtn.disabled = !(age.value && height.value && weight.value);
      });
    });

    calcBtn.addEventListener("click", () => {
      const gender = localStorage.getItem("gender");
      const activity = +localStorage.getItem("activity");

      const bmr =
        gender === "male"
          ? 9.99 * weight.value + 6.25 * height.value - 4.92 * age.value + 5
          : 9.99 * weight.value + 6.25 * height.value - 4.92 * age.value - 161;

      const calories = Math.round(bmr * activity);
      const bmi = (weight.value / ((height.value / 100) ** 2)).toFixed(1);

      result.innerHTML = `
        <b>Ваша норма калорий:</b> ${calories} ккал<br>
        <b>ИМТ:</b> ${bmi}
      `;
      result.classList.remove("hidden");
    });
  }
});

function toggleMethod() {
  document.getElementById("method").classList.toggle("hidden");
}
