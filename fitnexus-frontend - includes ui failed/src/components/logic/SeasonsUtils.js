// ✅ Ayurvedic Season Detector
export const detectAyurvedicSeason = (date = new Date()) => {
  const month = date.getMonth(); // 0 = Jan
  if (month >= 2 && month <= 3) return "Vasanta"; // Mar–Apr
  if (month >= 4 && month <= 5) return "Grishma"; // May–Jun
  if (month >= 6 && month <= 7) return "Varsha";  // Jul–Aug
  if (month >= 8 && month <= 9) return "Sharad";  // Sep–Oct
  if (month >= 10 && month <= 11) return "Hemant"; // Nov–Dec
  return "Shishir"; // Jan–Feb
};

// ✅ Seasonal Guidance Generator
export const generateSeasonalGuidance = (season, dosha) => {
  const base = {
    Vasanta: "🌸 Spring invites detox and renewal. Favor Kapha-pacifying practices like dynamic movement and dry brushing.",
    Grishma: "🔥 Summer brings heat—favor cooling breathwork, moon salutations, and coconut water.",
    Varsha: "🌧️ Rainy season increases Vata—ground with warm foods, oil massage, and slow movement.",
    Sharad: "🍂 Autumn is Pitta-aggravating—favor cooling foods, moon salutations, and journaling.",
    Hemant: "❄️ Early winter is nourishing—favor warming foods, sun salutations, and breath-led movement.",
    Shishir: "🌬️ Late winter increases Kapha—favor energizing breathwork, dry heat, and dynamic poses."
  };

  const doshaOverlay = {
    Vata: "🌾 Vata types benefit from grounding routines, warm meals, and oil massage.",
    Pitta: "🔥 Pitta types benefit from cooling breathwork, soft movement, and emotional reflection.",
    Kapha: "💧 Kapha types benefit from stimulation—dynamic yoga, dry brushing, and energizing foods."
  };

  return `${base[season]} ${doshaOverlay[dosha] || ""}`;
};
