import { analyzeJournalTone, generateAffirmation, generateJournalReflection, generateNarrativeTip } from './AffirmationUtils';
import { detectAyurvedicSeason, generateSeasonalGuidance } from './SeasonsUtils';

export const generateSuggestions = ({
  mood,
  energy,
  sleep,
  stressLevel,
  digestiveIssues,
  painArea,
  journal,
  timeOfDay,
  doshaType
}) => {
  const tips = [];

  const sleepTips = {
    Restful: "Sleep Tip: 🌙 Your body thanks you. Keep a consistent bedtime ritual.",
    Interrupted: "Sleep Tip: 🛌 Try restorative yoga and herbal tea before bed.",
    Insomnia: "Sleep Tip: 🧠 Practice Yoga Nidra and avoid screens before sleep.",
    LightSleep: "Sleep Tip: 🛌 Try Yoga Nidra and avoid caffeine after 2 PM.",
    Oversleeping: "Sleep Tip: 🌞 Morning sun exposure and energizing breathwork can reset your rhythm.",
    DreamDisturbed: "Sleep Tip: 🧠 Practice Bhramari and journaling before bed to calm the mind.",
    EarlyWaking: "Sleep Tip: 🌙 Wind down with restorative poses and avoid screen time late evening."
  };

  const stressTips = {
    None: "Stress Tip: 🧘 You’re calm and centered—maintain this with breath-led movement.",
    Mild: "Stress Tip: 🌿 Mild stress is natural—try alternate nostril breathing and journaling.",
    Moderate: "Stress Tip: 🌬️ Moderate stress can be eased with restorative yoga and mindful pauses.",
    Severe: "Stress Tip: 🔥 Severe stress needs attention—Yoga Nidra and guided meditation are recommended."
  };

  const digestionTips = {
    Bloating: "Digestion Tip: 🌿 Apanasana and gentle twists can relieve bloating and support digestion.",
    Constipation: "Digestion Tip: 🧘 Malasana and hydration help stimulate bowel movement.",
    Acidity: "Digestion Tip: 🔥 Avoid inverted poses; try cooling breathwork and seated forward folds."
  };

  const painTips = {
    Eyes: "Pain Tip: 👁️ Palming and Trataka (candle gazing) reduce eye strain.",
    Back: "Pain Tip: 🧘 Cat-Cow, Child’s Pose, and Bridge Pose for spinal relief.",
    Neck: "Pain Tip: 🧘 Griva Sanchalana, shoulder rolls, and Makarasana for cervical tension.",
    LowerBack: "Pain Tip: 🧘 Sphinx Pose and Supine Twist offer gentle relief.",
    Shoulders: "Pain Tip: 🧘 Thread-the-Needle and Eagle Arms help open tight shoulders.",
    Knees: "Pain Tip: 🧘 Chair yoga and supported Warrior I are safe and strengthening.",
    Ankles: "Pain Tip: 🧘 Reclined Hero Pose and ankle circles improve mobility.",
    Wrist: "Pain Tip: 🧘 Wrist stretches and Dolphin Pose reduce strain.",
    Headache: "Pain Tip: 🧘 Child’s Pose and Forward Fold to ease tension.",
    ChestTightness: "Pain Tip: 🧘 Fish Pose and Camel Pose to open the heart space.",
    Jaw: "Pain Tip: 🧘 Jaw release exercises and humming breath (Bhramari).",
    Fatigue: "Pain Tip: 🧘 Restorative yoga and Yoga Nidra support deep healing.",
    Abdomen: "Pain Tip: 🌿 Gentle twists and Apanasana support digestion.",
    Pelvis: "Pain Tip: 🧘 Baddha Konasana and supported Malasana for pelvic release.",
    Sciatica: "Pain Tip: 🧘 Supta Padangusthasana and hamstring stretches relieve nerve pressure.",
    Elbows: "Pain Tip: 🧘 Wrist and elbow rotations improve joint mobility.",
    Feet: "Pain Tip: 🧘 Toe stretches and balancing poses strengthen foot arches."
  };

  if (journal) {
    const tone = analyzeJournalTone(journal);
    const reflection = generateJournalReflection(tone);
    if (reflection) {
      tips.push(`Journal Reflection: ${reflection.message}`);
      tips.push(`Practice Suggestion: ${reflection.suggestion}`);
    }
  }

  if (timeOfDay === "Morning") tips.push("Time Tip: 🌞 Start your day with energizing breathwork and sun salutations.");
  if (timeOfDay === "Afternoon") tips.push("Time Tip: 🌿 Midday is ideal for mindful breaks—try short meditative pauses or stretches.");
  if (timeOfDay === "Evening") tips.push("Time Tip: 🌙 Wind down with restorative poses and journaling.");

  if (doshaType === "Pitta") tips.push("Ayurveda Tip: 🌿 Favor cooling breathwork, moon salutations, and coconut water to balance Pitta.");
  if (doshaType === "Vata") tips.push("Ayurveda Tip: 🌾 Ground your energy with warm foods, slow movement, and oil massage.");
  if (doshaType === "Kapha") tips.push("Ayurveda Tip: 🔥 Stimulate circulation with dynamic movement and dry heat therapies.");

  const moodNarrative = generateNarrativeTip("Mood", mood);
  if (moodNarrative) tips.push(`Mood Tip: ${moodNarrative}`);

  const energyNarrative = generateNarrativeTip("Energy", energy);
  if (energyNarrative) tips.push(`Energy Tip: ${energyNarrative}`);

  if (sleepTips[sleep]) tips.push(sleepTips[sleep]);
  if (stressTips[stressLevel]) tips.push(stressTips[stressLevel]);
  if (digestiveIssues && digestionTips[digestiveIssues]) tips.push(digestionTips[digestiveIssues]);
  if (painArea && painTips[painArea]) tips.push(painTips[painArea]);

  if (!mood) tips.push("🌿 Reflect on your mood to receive emotional wellness guidance.");
  if (!stressLevel) tips.push("🧘 Consider sharing your stress level to receive calming practices.");
  if (!sleep) tips.push("🌙 Sleep pattern helps us guide your rest—select one to continue.");

  if (!mood && !energy && !sleep && !stressLevel && !digestiveIssues && !painArea) {
    tips.push("🌿 You haven’t selected any wellness indicators yet. Try reflecting on your mood, energy, or sleep to begin.");
  }

  const season = detectAyurvedicSeason();
  const journalTone = analyzeJournalTone(journal);
  const affirmationObj = generateAffirmation({ mood, journalTone, doshaType, season });
  if (affirmationObj) {
    tips.push(`Affirmation: ${affirmationObj.text}`);
    tips.push(`Affirmation Practice: ${affirmationObj.practice}`);
    tips.push(`📿 Mantra: ${affirmationObj.mantra}`);
  }

  const seasonalTip = generateSeasonalGuidance(season, doshaType);
  if (seasonalTip) tips.push(`Seasonal Tip: ${seasonalTip}`);

  return tips;
};