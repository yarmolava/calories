// ---------- экран 1 ----------
function selectGender(g) {
  localStorage.setItem("gender", g);
  document.getElementById("nextBtn").disabled = false;
}

function goNext() {
  location.href = "activity.html";
}

function toggleMethod() {
  document.getElementById("method").classList.toggle("hidden");
}

// ---------- экран 2 ----------
function setActivity(v) {
  localStorage.setItem("activity", v);
}

function toggleManual(cb) {
  document.getElementById("manualValue").disabled = !cb.checked;
}

function goData() {
  const manual = document.getElementById("manualValue");
  if (!manual.disabled && manual.value) {
    localStorage.setItem("activity", manual.value);
  }
  location.href = "data.html";
}

// ---------- экран 3 ----------
function calculate() {
  const age = +document.getElementById("age").value;
  const height = +document.getElementById("height").value;
  const weight = +document.getElementById("weight").value;

  const gender = localStorage.getItem("gender");
  const activity = +localStorage.getItem("activity");

  let bmr =
    gender === "male"
      ? 9.99 * weight + 6.25 * height - 4.92 * age + 5
      : 9.99 * weight + 6.25 * height - 4.92 * age - 161;

  const calories = bmr * activity;
  const bmi = weight / ((height / 100) ** 2);

  document.getElementById("result").innerHTML = `
    <b>Ваша норма калорий:</b> ${Math.round(calories)} ккал<br>
    <b>ИМТ:</b> ${bmi.toFixed(1)}
  `;
  document.getElementById("result").classList.remove("hidden");
}
