document.addEventListener("DOMContentLoaded", () => {

  /* ====== МЕТОДИКА РАСЧЁТА ====== */
  window.toggleMethod = function () {
    const block = document.getElementById("method");
    if (!block) return;
    block.classList.toggle("hidden");
  };

  /* ====== INDEX ====== */
  const genderCards = document.querySelectorAll(".card[data-gender]");
  const nextBtn = document.getElementById("nextBtn");

  if (genderCards.length && nextBtn) {
    let gender = null;

    genderCards.forEach(card => {
      card.addEventListener("click", () => {
        genderCards.forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        gender = card.dataset.gender;
        localStorage.setItem("gender", gender);
        nextBtn.disabled = false;
      });
    });

    nextBtn.addEventListener("click", () => {
      if (gender) window.location.href = "activity.html";
    });
  }

  /* ====== ACTIVITY ====== */
  const activityItems = document.querySelectorAll(".activity-item");
  const activityNext = document.getElementById("activityNext");
  const manualBtn = document.getElementById("manualActivityBtn");
  const manualInput = document.getElementById("manualActivityInput");

  if (activityItems.length && activityNext) {
    let activity = null;

    const selectActivity = (value, element) => {
      activityItems.forEach(i => i.classList.remove("selected"));
      if (element) element.classList.add("selected");
      activity = value;
      localStorage.setItem("activity", activity);
      activityNext.disabled = !activity;
    };

    activityItems.forEach(item => {
      item.addEventListener("click", () => {
        selectActivity(item.dataset.activity, item);
        if (manualInput) manualInput.value = "";
      });
    });

    if (manualBtn && manualInput) {
      manualBtn.addEventListener("click", () => {
        manualInput.classList.toggle("hidden");
        manualInput.focus();
      });

      manualInput.addEventListener("input", () => {
        const val = parseFloat(manualInput.value.replace(",", "."));
        if (!isNaN(val) && val > 0) {
          selectActivity(val, null);
          activityNext.disabled = false;
          activityItems.forEach(i => i.classList.remove("selected"));
        } else {
          activityNext.disabled = true;
        }
      });
    }

    activityNext.addEventListener("click", () => {
      if (activity) window.location.href = "data.html";
    });
  }

  /* ====== DATA ====== */
  const age = document.getElementById("age");
  const height = document.getElementById("height");
  const weight = document.getElementById("weight");
  const goals = document.querySelectorAll('input[name="goal"]');
  const dataNext = document.getElementById("dataNext");

  if (age && height && weight && dataNext) {
    const validate = () => {
      const valid =
        age.value > 0 &&
        height.value > 0 &&
        weight.value > 0 &&
        [...goals].some(g => g.checked);
      dataNext.disabled = !valid;
    };

    [age, height, weight].forEach(i => i.addEventListener("input", validate));
    goals.forEach(g => g.addEventListener("change", validate));

    dataNext.addEventListener("click", () => {
      localStorage.setItem("age", age.value);
      localStorage.setItem("height", height.value);
      localStorage.setItem("weight", weight.value);
      localStorage.setItem("goal", [...goals].find(g => g.checked).value);
      window.location.href = "result.html";
    });
  }
});
