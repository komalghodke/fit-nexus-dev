import { generateSuggestions } from '../logic/SuggestionEngine';
import { calculateWellnessScore } from '../logic/scoreCalculator';
import { buildWellnessSummary } from '../logic/summaryBuilder';
import { detectChakra, analyzeJournalTone,
  generateJournalReflection } from '../logic/AffirmationUtils';

export const generateWellnessResponse = (inputs) => {
  const {
    mood,
    energy,
    sleep,
    stressLevel,
    digestiveIssues,
    painArea,
    journal,
    sleepHours,
    height,
    weight,
    waterIntake,
    heartRate,
    experienceLevel,
    activityType,
    activityDays,
    activityDuration,
    hasDisease,
    innerPeace,
    socialSupport,
    workSatisfaction,
    withNature
  } = inputs;

  const guidance = [];
  const push = (msg) => {
    if (msg && !guidance.includes(msg)) guidance.push(msg);
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 10) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
  };

  const detectDosha = () => {
    if (mood === 'Anxious' || sleep === 'Interrupted' || digestiveIssues === 'Constipation') return 'Vata';
    if (mood === 'Angry' || digestiveIssues === 'Acidity' || sleep === 'EarlyWaking') return 'Pitta';
    if (energy === 'Sluggish' || sleep === 'Oversleeping' || digestiveIssues === 'Bloating') return 'Kapha';
    return '';
  };

  const doshaType = detectDosha();
  const timeOfDay = getTimeOfDay();

  if (!doshaType) push("🌿 Your constitution appears balanced—maintain it with seasonal alignment and mindful movement.");

  const tips = generateSuggestions({
    mood,
    energy,
    sleep,
    stressLevel,
    digestiveIssues,
    painArea,
    journal,
    timeOfDay,
    doshaType
  });

  const score = calculateWellnessScore({
    mood,
    energy,
    sleep,
    stressLevel,
    painArea,
    sleepHours,
    waterIntake,
    heartRate
  });

  const journalEntry = journal || '';
  const journalTone = analyzeJournalTone(journalEntry);
  const journalReflection = generateJournalReflection(journalTone);
  const chakraOutput = detectChakra(journalEntry);

  const response = {};
  if (chakraOutput) {
    response.chakra = chakraOutput.chakra.toLowerCase();
    response.affirmation = chakraOutput.affirmation;
    response.mantra = chakraOutput.mantra;
    response.practice = chakraOutput.practice;
  }

  response.journalReflection = journalReflection.message;
  response.journalSuggestion = journalReflection.suggestion;

  const status = score >= 8 ? "🌟 Excellent" : score >= 5 ? "🌿 Moderate" : "⚠️ Needs Attention";
  push(`Your wellness score is ${score}/10 — ${status}`);

  const bmi = height && weight ? (weight / ((height / 100) ** 2)).toFixed(1) : null;
  if (bmi) {
    if (bmi > 25) push("Your BMI suggests mindful movement and hydration.");
    else if (bmi < 18.5) push("Let’s focus on nourishment and gentle strengthening.");
    else push("Your body is in balance—maintain it with consistency.");
  }

  if (waterIntake < 2) push("Your water intake is below optimal—aim for 2–3L daily.");
  else push("Your hydration level looks good—keep sipping mindfully throughout the day.");

  if (heartRate < 60) push("Your resting heart rate is low—ensure you're not overtraining or under stress.");
  else if (heartRate <= 90) push("Your heart rate is within a healthy range.");
  else push("Elevated heart rate may indicate stress or fatigue—consider restorative practices.");

  if (sleepHours < 6) push("Your sleep is below optimal—prioritize rest and recovery.");
  else push("Your sleep duration is healthy—keep your rhythm steady.");

  if (journal) {
    const journalLower = journal.toLowerCase();
    const positiveWords = ["grateful", "hopeful", "joy", "peace"];
    const negativeWords = ["stress", "anxious", "tired", "overwhelmed"];
    const positives = positiveWords.filter(word => journalLower.includes(word)).length;
    const negatives = negativeWords.filter(word => journalLower.includes(word)).length;
    if (positives > negatives) push("Your journal reflects positivity—keep nurturing that mindset.");
    else if (negatives > positives) push("Your journal reflects emotional strain—gentle practices can help restore balance.");
    else push("Your journal offers insight—consider pairing it with breathwork or movement.");
  }

  if (experienceLevel === "Beginner") push("🌱 You’re just starting—focus on breath awareness and consistency.");
  else if (experienceLevel === "Active") push("💪 Your active lifestyle is a great base—yoga can enhance flexibility and recovery.");
  else if (experienceLevel === "Yoga Practitioner") push("🧘‍♂️ You’re experienced—consider personalized sequences based on your wellness profile.");

  if (activityType && activityType !== "None") {
    push(`🏃 You engage in ${activityType} about ${activityDays} days/week for ${activityDuration} minutes. Yoga can complement this with breath-led movement and recovery.`);
  }

  if (hasDisease === "true") push("🩺 You’ve indicated a medical condition—please consult your doctor before starting any new physical activity.");

  if (innerPeace === "true") push("🧘 You feel connected to a deeper purpose—maintain this with daily breathwork and intention-setting.");
  else if (innerPeace === "false") push("🌿 Consider exploring meditation or journaling to reconnect with your inner self.");

  if (socialSupport === "true") push("🤝 You feel supported—nurture these connections through shared movement or gratitude practices.");
  else if (socialSupport === "false") push("💬 Consider reaching out—group yoga or mindful community spaces may offer comfort.");

  if (workSatisfaction >= 7) push("💼 Your work-life balance seems healthy—maintain it with mindful breaks and movement.");
  else if (workSatisfaction >= 4) push("📅 Moderate satisfaction—try time-blocking and restorative yoga.");
  else push("⚠️ Low satisfaction—consider breathwork and journaling to reset your rhythm.");

  if (withNature >= 2) push("🌳 Time in nature supports emotional and physical wellness—keep connecting with the outdoors and natural spaces.");
  else push("🌱 Try spending more time in nature—morning walks or mindful observation can help.");

  const summary = buildWellnessSummary(inputs, score, status);

  const batch = `🌿 Your Next Step
Yoga may offer the support your body and mind are asking for. Whether you prefer a group session or a personalized practice, we’re here to guide you with care and respect for your unique rhythm.
📩 Reach out anytime at support@yogdhara.com to explore what might suit your rhythm.`;

  return {
    tips,
    guidance,
    batch,
    bmi: bmi ? parseFloat(bmi) : null,
    summary,
    chakra: response.chakra,
    affirmation: response.affirmation,
    mantra: response.mantra,
    practice: response.practice,
    journalReflection: response.journalReflection,
    journalSuggestion: response.journalSuggestion
  };

};