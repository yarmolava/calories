// Mifflin-St Jeor calculator + macros (protein upper bound by default)
document.addEventListener('DOMContentLoaded', () => {
  const el = id;
  const calcBtn = el('calcBtn');
  const resetBtn = el('resetBtn');
  const results = el('results');

  calcBtn.addEventListener('click', doCalc);
  resetBtn.addEventListener('click', resetForm);

  // tabs
  document.querySelectorAll('.tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      const target = t.dataset.target;
      document.getElementById(target).classList.add('active');
    });
  });

  function doCalc() {
    const gender = el('gender').value;
    const weight = parseFloat(el('weight').value);
    const height = parseFloat(el('height').value);
    const age = parseFloat(el('age').value);
    const activity = parseFloat(el('activity').value);
    const goal = el('goal').value;
    const proteinFactor = parseFloat(el('proteinFactor').value) || 2.2;
    const fatPercent = parseFloat(el('fatPercent').value) || 25;

    if (!weight || !height || !age) {
      alert('Заполни: вес, рост, возраст.');
      return;
    }

    // Mifflin-St Jeor
    // BMR = 10*weight + 6.25*height - 5*age + s (s = +5 men, -161 women)
    const s = (gender === 'male') ? 5 : -161;
    const bmr = 10 * weight + 6.25 * height - 5 * age + s;
    const tdee = Math.round(bmr * activity);

    // goal multiplier
    let goalCal;
    if (goal === 'loss') goalCal = Math.round(tdee * 0.8); // -20%
    else if (goal === 'gain') goalCal = Math.round(tdee * 1.15); // +15%
    else goalCal = Math.round(tdee);

    // Macros:
    // protein g = weight * proteinFactor (user wants upper bound)
    const proteinG = Math.round(weight * proteinFactor);
    const proteinCal = proteinG * 4;

    // fats calorie = goalCal * fatPercent/100
    const fatCal = Math.round(goalCal * (fatPercent / 100));
    const fatG = Math.round(fatCal / 9);

    // carbs calories = remaining
    let carbsCal = goalCal - proteinCal - fatCal;
    if (carbsCal < 0) {
      // if negative (rare with very high protein + low calories), reduce protein until >=0
      const maxProteinG = Math.max(0, Math.floor((goalCal - fatCal) / 4));
      proteinG = maxProteinG;
      proteinCal = proteinG * 4;
      carbsCal = goalCal - proteinCal - fatCal;
    }
    const carbG = Math.round(carbsCal / 4);

    // Show results
    el('bmrVal').textContent = Math.round(bmr);
    el('tdeeVal').textContent = tdee;
    el('goalCalVal').textContent = goalCal;

    el('proteinGr').textContent = proteinG;
    el('fatGr').textContent = fatG;
    el('carbGr').textContent = carbG;

    el('proteinPerc').textContent = proteinCal + ' ккал';
    el('fatPerc').textContent = fatCal + ' ккал';
    el('carbPerc').textContent = carbsCal + ' ккал';

    el('proteinFactorShow').textContent = proteinFactor.toFixed(1);

    results.classList.remove('hidden');
    // switch to summary tab
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(x => x.classList.remove('active'));
    document.querySelector('.tab[data-target="summary"]').classList.add('active');
    document.getElementById('summary').classList.add('active');
  }

  function resetForm() {
    document.getElementById('weight').value = '';
    document.getElementById('height').value = '';
    document.getElementById('age').value = '';
    document.getElementById('proteinFactor').value = '2.2';
    document.getElementById('fatPercent').value = '25';
    document.getElementById('results').classList.add('hidden');
  }

  function id(s){ return document.getElementById(s); }
  // alias used above
  function el(s){ return id(s); }
});
script.js
