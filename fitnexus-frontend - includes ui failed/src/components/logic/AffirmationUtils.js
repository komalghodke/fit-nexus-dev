// ✅ Journal Tone Analyzer
export const analyzeJournalTone = (text) => {
  const lower = text.toLowerCase();
  const positiveWords = ["grateful", "joy", "peace", "hope", "love"];
  const negativeWords = ["stress", "anxious", "tired", "sad", "overwhelmed", "lonely"];
  const neutralWords = ["reflect", "observe", "notice", "aware"];

  const positives = positiveWords.filter(w => lower.includes(w)).length;
  const negatives = negativeWords.filter(w => lower.includes(w)).length;
  const neutrals = neutralWords.filter(w => lower.includes(w)).length;

  if (positives > negatives && positives > neutrals) return "Positive";
  if (negatives > positives && negatives > neutrals) return "Negative";
  return "Neutral";
};

// ✅ Journal Reflection Generator
export const generateJournalReflection = (tone) => {
  switch (tone) {
    case "Positive":
      return {
        message: "🌼 Your words radiate light. Let’s honor this joy with heart-opening movement and breath-led gratitude.",
        suggestion: "Try Bhujangasana and journaling on what brings you peace."
      };
    case "Negative":
      return {
        message: "🌧️ Your reflection carries emotional weight. Let’s begin with breath and gentle movement to ease the strain.",
        suggestion: "Practice Child’s Pose and Bhramari breath to calm your system."
      };
    case "Neutral":
      return {
        message: "🪞 You’re observing your inner world. Let’s deepen that awareness with meditative movement and stillness.",
        suggestion: "Try seated meditation and Trataka to enhance clarity."
      };
    default:
      return null;
  }
};

// ✅ Affirmation Generator
export const generateAffirmation = ({ mood, journalTone, doshaType, season }) => {
  const moodAffirmations = {
    Lonely: {
      text: "I am worthy of connection. My breath links me to the world.",
      practice: "Try mantra chanting or group yoga to reconnect.",
      mantra: "So Hum – I am That."
    },
    Angry: {
      text: "I release what no longer serves me. I move with clarity.",
      practice: "Practice cooling breathwork and forward folds.",
      mantra: "Om Shanti – Peace within."
    },
    Grateful: {
      text: "I honor the gifts in my life. My heart is open.",
      practice: "Begin with heart-opening poses and gratitude journaling.",
      mantra: "Om – The universal vibration."
    },
    Sad: {
      text: "I allow myself to feel. Healing begins with breath.",
      practice: "Try restorative yoga and gentle breath awareness.",
      mantra: "Om Namah Shivaya – I honor transformation."
    },
    Hopeful: {
      text: "I trust the unfolding. My energy flows with purpose.",
      practice: "Practice energizing movement and intention setting.",
      mantra: "Ram – Inner strength and clarity."
    },
    Calm: {
      text: "I rest in stillness. Peace is my nature.",
      practice: "Try Yoga Nidra or seated meditation.",
      mantra: "Om Shanti – Peace within."
    },
    Stressed: {
      text: "I soften into the moment. I am supported.",
      practice: "Practice restorative poses and slow breathwork.",
      mantra: "So Hum – I am That."
    },
    Anxious: {
      text: "I ground myself in breath. I am safe.",
      practice: "Try Child’s Pose and Bhramari breath.",
      mantra: "Lam – Root chakra grounding."
    },
    Joyful: {
      text: "I celebrate my light. I radiate joy.",
      practice: "Dance, flow, and share your joy through movement.",
      mantra: "Om – The universal vibration."
    },
    Irritable: {
      text: "I pause and listen. My breath cools the fire.",
      practice: "Try Sheetali breath and moon salutations.",
      mantra: "Om Shanti – Peace within."
    }
  };

  const journalAffirmations = {
    Positive: {
      text: "I nurture my light. Gratitude guides my rhythm.",
      practice: "Practice Bhujangasana and gratitude journaling.",
      mantra: "Om – The universal vibration."
    },
    Negative: {
      text: "I honor my emotions. I breathe through the storm.",
      practice: "Try Child’s Pose and Bhramari breath.",
      mantra: "Om Namah Shivaya – I honor transformation."
    },
    Neutral: {
      text: "I observe without judgment. Awareness is my anchor.",
      practice: "Try seated meditation and Trataka.",
      mantra: "So Hum – I am That."
    }
  };

  const doshaAffirmations = {
    Vata: {
      text: "I root myself in warmth and rhythm.",
      practice: "Practice grounding poses and warm oil massage.",
      mantra: "Lam – Root chakra grounding."
    },
    Pitta: {
      text: "I cool my fire with compassion and breath.",
      practice: "Try Sheetali breath and moon salutations.",
      mantra: "Om Shanti – Peace within."
    },
    Kapha: {
      text: "I rise with lightness and clarity.",
      practice: "Practice dynamic movement and dry brushing.",
      mantra: "Ram – Inner strength and clarity."
    }
  };

  const seasonalAffirmations = {
    Sharad: {
      text: "I soften into the rhythm of autumn.",
      practice: "Try moon salutations and cooling foods.",
      mantra: "Om Shanti – Peace within."
    },
    Grishma: {
      text: "I flow gently through the heat of summer.",
      practice: "Practice Sheetkari breath and restorative yoga.",
      mantra: "Om – The universal vibration."
    },
    Varsha: {
      text: "I ground myself in the rain’s embrace.",
      practice: "Try warm foods, oil massage, and slow movement.",
      mantra: "Lam – Root chakra grounding."
    },
    Hemant: {
      text: "I nourish my body with warmth and movement.",
      practice: "Practice sun salutations and warming breathwork.",
      mantra: "Ram – Inner strength and clarity."
    },
    Shishir: {
      text: "I awaken energy with breath and motion.",
      practice: "Try energizing breathwork and dynamic poses.",
      mantra: "Ram – Inner strength and clarity."
    },
    Vasanta: {
      text: "I bloom with renewal and clarity.",
      practice: "Practice detoxifying twists and breath-led movement.",
      mantra: "Om – The universal vibration."
    }
  };

  return (
    moodAffirmations[mood] ||
    journalAffirmations[journalTone] ||
    doshaAffirmations[doshaType] ||
    seasonalAffirmations[season] || {
      text: "I am present. I am enough.",
      practice: "Begin with breath awareness and gentle movement.",
      mantra: "Om – The universal vibration."
    }
  );
};

// ✅ Narrative Tip Generator
export const generateNarrativeTip = (type, context) => {
  if (type === "Mood") {
    switch (context) {
      case "Lonely":
        return `🤝 You’ve shared that you’re feeling lonely. This emotion often arises when we feel disconnected—not just from others, but sometimes from ourselves. Movement can be a bridge. Group yoga, mantra chanting, or even a shared breath practice can gently remind you: you are not alone. Connection begins with presence—and presence begins with breath.`;
      case "Angry":
        return `🌪️ Anger is a powerful energy—it deserves space to move and release. Dynamic sequences like Surya Namaskar can help channel this intensity into flow. Through movement, we transform heat into clarity. Let your breath lead the way.`;
      case "Grateful":
        return `🌸 Gratitude is a healing force. When you feel grateful, your heart opens. Bhujangasana (Cobra Pose) with intention can amplify this openness. Reflect on what you’re thankful for and let that light guide your movement.`;
      case "Sad":
        return `💙 Sadness is not weakness—it’s a signal from within. Heart-opening poses and gentle journaling can help you process and release. Let your breath be your companion as you move through this space.`;
      case "Hopeful":
        return `🌈 Hope is a beautiful energy—it lifts, it expands. Channel it into creative flow and breath-led movement. Your optimism is a gift—let it guide your rhythm today.`;
      case "Calm":
        return `🧘 Calmness is a gift—an inner stillness that invites clarity. Let this peace guide your breath and movement. Gentle flows and meditative pauses will help you stay rooted in this serenity.`;
      case "Stressed":
        return `🌬️ Stress is your body’s way of asking for pause. It’s okay to slow down. Try restorative poses and deep breathing to ease the tension. You are supported, and you are safe.`;
      case "Anxious":
        return `🌿 Anxiety can feel like a whirlwind of thoughts. Grounding practices like Child’s Pose and slow breathwork help bring you back to center. Let your breath be your anchor.`;
      case "Joyful":
        return `🌼 Joy is radiant—let it flow through your movement. Heart-opening poses and expressive breathwork can amplify your light. Share it, celebrate it, embody it.`;
      case "Irritable":
        return `🔥 Irritability often masks deeper fatigue or overstimulation. Cooling breathwork and forward folds can help soothe your system. Give yourself space to soften.`;
      default:
        return "";
    }
  }

  if (type === "Energy") {
    switch (context) {
      case "Hyperactive":
        return `🌪️ Your energy feels heightened—like a storm within. This can lead to restlessness, scattered thoughts, and emotional fatigue. Slow, mindful movement acts like an anchor, helping you return to your breath and body. Begin with gentle forward folds or seated twists to invite calm into your system.`;
      case "Low":
        return `⚡ When energy dips, it’s easy to feel sluggish or uninspired. Sunlight, hydration, and Surya Namaskar can gently awaken your system. You’re not trying to force energy—you’re inviting it with care.`;
      case "Balanced":
        return `🌈 Your energy is in flow. This is a beautiful state—maintain it with gentle movement, breath awareness, and gratitude. You’re aligned—let’s keep you there.`;
      case "MentallyFatigued":
        return `🧠 Mental fatigue can cloud clarity and focus. Practices like Bhramari and Trataka help refresh the mind and soothe the nervous system. Give your thoughts space to breathe.`;
      case "PhysicallyTired":
        return `🛌 Physical tiredness is your body’s request for restoration. Restorative poses and Yoga Nidra offer deep healing. Honor your body’s need to pause.`;
      case "Sluggish":
        return `🌞 Sluggishness often comes from stagnation. Sun exposure, energizing breathwork, and gentle movement can reset your rhythm. Let’s invite vitality back in.`;
      default:
        return "";
    }
  }

  return "";
};

// Chakra-Based Affirmation Engine

const chakraMap = {
  root: {
    keywords: ['anxious', 'hopeless', 'unloved', 'robotic', 'unsafe', 'stress'],
    affirmation: 'I ground myself in breath. I am safe.',
    mantra: 'Lam',
    practice: 'Child’s Pose and Bhramari breath',
  },
  sacral: {
    keywords: ['tired', 'drained', 'numb', 'emotionless'],
    affirmation: 'I honor my emotions and flow with ease.',
    mantra: 'Vam',
    practice: 'Hip openers and fluid movement',
  },
  solar: {
    keywords: ['confused', 'stuck', 'indecisive'],
    affirmation: 'I trust my decisions and inner fire.',
    mantra: 'Ram',
    practice: 'Core work and Kapalabhati breath',
  },
  heart: {
    keywords: ['hopeful', 'seeking', 'inspired'],
    affirmation: 'I open my heart to love and healing.',
    mantra: 'Yam',
    practice: 'Backbends and gratitude journaling',
  },
  throat: {
    keywords: ['creative', 'joyful', 'radiant'],
    affirmation: 'I speak my truth with clarity.',
    mantra: 'Ham',
    practice: 'Chanting and lion’s breath',
  },
  thirdEye: {
    keywords: ['aware', 'introspective', 'wise'],
    affirmation: 'I trust my intuition and inner wisdom.',
    mantra: 'Om',
    practice: 'Meditation and Trataka',
  },
  crown: {
    keywords: ['calm', 'serene', 'connected'],
    affirmation: 'I am connected to the divine within.',
    mantra: 'Silence',
    practice: 'Savasana and breath awareness',
  },
};

export function detectChakra(journalText) {
  const lowerText = journalText.toLowerCase();
  let matchedChakra = null;

  for (const [chakra, data] of Object.entries(chakraMap)) {
    for (const keyword of data.keywords) {
      if (lowerText.includes(keyword)) {
        matchedChakra = chakra;
        break;
      }
    }
    if (matchedChakra) break;
  }

  return matchedChakra
    ? {
        chakra: matchedChakra,
        affirmation: chakraMap[matchedChakra].affirmation,
        mantra: chakraMap[matchedChakra].mantra,
        practice: chakraMap[matchedChakra].practice
      }
    : null;
}