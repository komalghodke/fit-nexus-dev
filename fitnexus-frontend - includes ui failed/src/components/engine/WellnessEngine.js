import { useEffect, useState } from 'react';
import { analyzeJournalTone } from '../logic/AffirmationUtils';

export const useWellnessEngine = ({
  suggestions,
  guidance,
  journal,
  mood,
  energy,
  sleepHours,
  email = "anonymous"
}) => {
  const scoreText = guidance.find(g => g.includes("wellness score")) || "Score unavailable";
  const scoreValue = parseInt(scoreText.match(/\d+/)?.[0]) || 0;
  const timestamp = new Date().toISOString();

  const currentEntry = {
    timestamp,
    score: scoreValue,
    mood,
    sleepHours,
    energy,
    journalTone: analyzeJournalTone(journal),
    affirmation: suggestions.find(t => t.includes("Affirmation:"))?.replace("Affirmation: ", ""),
    practice: suggestions.find(t => t.includes("Affirmation Practice:"))?.replace("Affirmation Practice: ", ""),
    mantra: suggestions.find(t => t.includes("📿 Mantra:"))?.replace("📿 Mantra: ", "")
  };

  const historyKey = `wellnessHistory_${email}`;
  const [wellnessHistory, setWellnessHistory] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(historyKey)) || [];
    const updated = [...stored, currentEntry];
    localStorage.setItem(historyKey, JSON.stringify(updated));
    setWellnessHistory(updated);
  }, [email, scoreText, journal]); // triggers update when journal or score changes

  return { scoreText, scoreValue, wellnessHistory };
};