export const buildWellnessSummary = (inputs, score, status) => {
  const summaryParts = [];

  summaryParts.push(`Namaste ${inputs.fullName || "Seeker"} Ji, welcome to your YogDhara wellness reflection.`);

  if (inputs.mood || inputs.energy || inputs.stressLevel || inputs.sleep) {
    summaryParts.push(`Emotionally, you're navigating a mix of ${inputs.mood || "unshared mood"}, ${inputs.energy || "unshared energy"}, and ${inputs.stressLevel || "unshared stress level"}.`);
    summaryParts.push(`Your sleep pattern is ${inputs.sleep || "not specified"}, with about ${inputs.sleepHours || "unknown"} hours of rest.`);
  }

  if (inputs.mood) summaryParts.push(`Your current mood is "${inputs.mood}", reflecting your emotional state today.`);
  if (inputs.energy) summaryParts.push(`Your energy level is "${inputs.energy}", showing how your body and mind are responding to your rhythm.`);
  if (inputs.sleep) summaryParts.push(`Your sleep pattern is "${inputs.sleep}", and you've been getting around ${inputs.sleepHours || '...'} hours of rest.`);
  if (inputs.stressLevel) summaryParts.push(`Your stress level is "${inputs.stressLevel}", which may influence your emotional and physical balance.`);

  if (inputs.digestiveIssues && inputs.digestiveIssues !== "None") summaryParts.push(`You’ve noted digestive issues like "${inputs.digestiveIssues}", which yoga and hydration may help ease.`);
  if (inputs.painArea && inputs.painArea !== "None") summaryParts.push(`You’ve reported discomfort in your "${inputs.painArea}", and gentle movement may support relief.`);

  if (inputs.experienceLevel) summaryParts.push(`You identify as a "${inputs.experienceLevel}" in yoga, which helps us tailor your practice.`);
  if (inputs.activityType && inputs.activityType !== "None") {
    summaryParts.push(`You engage in "${inputs.activityType}" about ${inputs.activityDays} days/week for ${inputs.activityDuration} minutes.`);
  }

  if (inputs.journal) summaryParts.push(`Your journal entry reflects: "${inputs.journal}". This offers insight into your emotional landscape.`);

  if (inputs.innerPeace === "true") summaryParts.push(`You feel connected to a higher purpose or inner peace—this supports spiritual wellness.`);
  if (inputs.socialSupport === "true") summaryParts.push(`You feel supported by friends or family—this strengthens your social wellness.`);
  if (inputs.workSatisfaction) summaryParts.push(`Your work-life satisfaction is rated ${inputs.workSatisfaction}/10, reflecting your occupational wellness.`);
  if (inputs.withNature) summaryParts.push(`You spend about ${inputs.withNature} hours/week in nature, which nurtures your environmental wellness.`);

  summaryParts.push(`Your wellness score is ${score}/10 — ${status}. This score reflects your overall balance across multiple dimensions.`);
  summaryParts.push(`Based on your profile, yoga may support your journey through breath-led movement, emotional awareness, and gentle reflection.`);

  return summaryParts.join(" ");
};
