export function generateSleepStressTips(sleepHours, stressLevel) {
  let tips = [];

  if (sleepHours < 7) {
    tips.push("Aim for 7–8 hours of restful sleep.");
    tips.push("Practice Yoga Nidra and avoid screens before bed.");
  }

  if (stressLevel === "Severe") {
    tips.push("Severe stress needs attention—guided meditation and breathwork are recommended.");
    tips.push("Try restorative yoga poses to calm the nervous system.");
  }

  if (stressLevel === "Moderate") {
    tips.push("Balance your day with pranayama and light physical activity.");
  }

  return tips;
}

export function calculateWellnessScore(sleepHours, stressLevel) {
  let score = 10;
  if (sleepHours < 6) score -= 2;
  if (stressLevel === "Severe") score -= 3;

  if (score >= 8) return { score, status: "Excellent" };
  if (score >= 5) return { score, status: "Moderate" };
  return { score, status: "Needs Attention" };
}
