import React from 'react';
import NarrativeTipCard from './NarrativeTipCard';

const WellnessTips = ({ suggestions, guidance, practiceBlock, filterGuidance, excludeGuidance, renderGuidance }) => (
  <>
    {suggestions.some(tip => tip.includes("Mood Tip") || tip.includes("Energy Tip")) && (
      <div>
        <h4>🧘 Mood & Energy Tips</h4>
        {suggestions.filter(tip =>
          tip.includes("Mood Tip") || tip.includes("Energy Tip")
        ).map((tip, index) => {
          const isMood = tip.includes("Mood Tip");
          const icon = isMood ? "🧘" : "⚡";
          const title = isMood ? "Mood Insight" : "Energy Insight";
          const [_, narrative] = tip.split(": ");
          return (
            <NarrativeTipCard
              key={`mood-energy-${index}`}
              icon={icon}
              title={title}
              narrative={narrative}
              explanation={isMood
                ? "Mood influences your breath, thoughts, and energy. Awareness is the first step toward balance."
                : "Energy levels reflect your vitality. Movement and breathwork help regulate and restore it."
              }
            />
          );
        })}
      </div>
    )}

    {suggestions.some(tip => tip.includes("Sleep Tip") || tip.includes("Stress Tip")) && (
      <>
        <h4>🌙 Sleep & Stress Tips</h4>
        <ul>
          {suggestions.filter(tip =>
            tip.includes("Sleep Tip") || tip.includes("Stress Tip")
          ).map((tip, index) => (
            <li key={`sleep-stress-${index}`}>{tip}</li>
          ))}
        </ul>
      </>
    )}

    {suggestions.some(tip => tip.includes("Digestion Tip") || tip.includes("Pain Tip")) && (
      <>
        <h4>🦠 Digestive & Pain Tips</h4>
        <ul>
          {suggestions.filter(tip =>
            tip.includes("Digestion Tip") || tip.includes("Pain Tip")
          ).map((tip, index) => (
            <li key={`digestive-${index}`}>{tip}</li>
          ))}
        </ul>
      </>
    )}

    {filterGuidance(["water", "heart rate"]).length > 0 && (
      <>
        <h4>💧 Hydration & Heart Health</h4>
        <ul>{renderGuidance(filterGuidance(["water", "heart rate"]), "hydration-heart")}</ul>
      </>
    )}

    {excludeGuidance([
      "water", "heart rate", "wellness score",
      "dosha", "prakriti", "ayurvedic", "season",
      "inner self", "higher purpose", "support", "community",
      "work-life", "balance", "nature", "outdoors"
    ]).length > 0 && (
      <>
        <h4>🧠 Health Insights</h4>
        <ul>{renderGuidance(excludeGuidance([
          "water", "heart rate", "wellness score",
          "dosha", "prakriti", "ayurvedic", "season",
          "inner self", "higher purpose", "support", "community",
          "work-life", "balance", "nature", "outdoors"
        ]), "health")}</ul>
      </>
    )}

    {practiceBlock && (
      <div className="practice-guidance">
        <h4>🧘 Practice That Meets You</h4>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{practiceBlock}</pre>
      </div>
    )}
  </>
);

export default WellnessTips;