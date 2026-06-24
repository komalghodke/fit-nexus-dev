import React from 'react';
import '../../styles/NarrativeTipCard.css';
import { useWellnessEngine } from '../engine/WellnessEngine';
import WellnessTips from './WellnessTips';
import WellnessRender from './WellnessRender';
import ChakraOutput from '../render/ChakraOutput';

const WellnessDisplay = (props) => {
  const {
    suggestions,
    guidance,
    journal,
    mood,
    energy,
    sleepHours,
    summary,
    hasDisease,
    affirmation,
    mantra,
    practice,
    chakra,
    journalReflection,
    journalSuggestion
  } = props;

  const { scoreText, scoreValue, wellnessHistory } = useWellnessEngine({
    suggestions,
    guidance,
    journal,
    mood,
    energy,
    sleepHours,
    email: props.email || props.inputs?.email || "anonymous"
  });
  
  const practiceBlock = guidance.find(g => g.includes("Practice That Meets You"));
  const shownMessages = new Set();

  const renderGuidance = (messages, keyPrefix) =>
    messages.filter(msg => {
      if (msg === practiceBlock) return false;
      if (shownMessages.has(msg)) return false;
      shownMessages.add(msg);
      return true;
    }).map((msg, index) => <li key={`${keyPrefix}-${index}`}>{msg}</li>);

  const filterGuidance = (keywords) =>
    guidance.filter(g => keywords.some(k => g.toLowerCase().includes(k)));

  const excludeGuidance = (keywords) =>
    guidance.filter(g => !keywords.some(k => g.toLowerCase().includes(k)));

  return (
    <div className="wellness-suggestions">
      <h3>🌿 Your Personalized Guidance</h3>
      <WellnessTips
        suggestions={suggestions}
        guidance={guidance}
        practiceBlock={practiceBlock}
        filterGuidance={filterGuidance}
        excludeGuidance={excludeGuidance}
        renderGuidance={renderGuidance}
      />
      
      {journalReflection && (
        <div className="journal-reflection-block">
          {journal && (
            <div className="journal-entry-block">
              <h4>📝 Your Journal Entry</h4>
              <p>{journal}</p>
            </div>
          )}
          <h4>🪞 Journal Reflection</h4>
          <p>{journalReflection}</p>
          <p><strong>Suggestion:</strong> {journalSuggestion}</p>
        </div>
      )}

      {/* ✨ Chakra-Based Affirmation Section */}
      {affirmation && (
        <ChakraOutput
          chakra={chakra}
          affirmation={affirmation}
          mantra={mantra}
          practice={practice}
        />
      )}

      <WellnessRender
        suggestions={suggestions}
        scoreText={scoreText}
        scoreValue={scoreValue}
        wellnessHistory={wellnessHistory}
        summary={summary}
        hasDisease={hasDisease}
      />
    </div>
  );
};

export default WellnessDisplay;