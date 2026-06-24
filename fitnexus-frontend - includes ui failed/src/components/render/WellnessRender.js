import React from 'react';
import WellnessHistory from './WellnessHistory';
import '../../styles/NarrativeTipCard.css';
import WellnessProgressChart from './WellnessProgressChart';
import ChakraJourneyChart from './ChakraJourneyChart';
import JournalToneChart from './JournalToneChart';

const WellnessRender = ({
  suggestions,
  scoreText,
  scoreValue,
  wellnessHistory,
  summary,
  hasDisease
}) => {
  // ✅ Deduplicate entries AFTER props are received
  const getUniqueEntries = (entries) => {
    const seen = new Set();
    return entries.filter(entry => {
      const key = `${entry.timestamp}-${entry.journalTone}-${entry.mood}-${entry.energy}-${entry.score}-${entry.affirmation}-${entry.practice}-${entry.mantra}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const uniqueHistory = getUniqueEntries(wellnessHistory || []);

  return (
    <>
      {/* Affirmation Block */}
      {suggestions.some(tip => tip.includes("Affirmation:")) && (
        <div className="affirmation-block">
          <h4>✨ Special Affirmation for you...</h4>
          {suggestions.filter(tip => tip.includes("Affirmation:")).map((tip, index) => (
            <p key={`affirmation-${index}`} style={{ fontStyle: 'italic', fontSize: '18px', color: '#4b0082' }}>
              {tip.replace("Affirmation: ", "")}
            </p>
          ))}
        </div>
      )}

      {suggestions.some(tip => tip.includes("Affirmation Practice:")) && (
        <>
          <h4>🧘 Practice for Your Affirmation</h4>
          <ul>
            {suggestions.filter(tip => tip.includes("Affirmation Practice:")).map((tip, index) => (
              <li key={`affirmation-practice-${index}`}>{tip.replace("Affirmation Practice: ", "")}</li>
            ))}
          </ul>
        </>
      )}

      {suggestions.some(tip => tip.includes("📿 Mantra:")) && (
        <>
          <h4>📿 Mantra for Today</h4>
          <ul>
            {suggestions.filter(tip => tip.includes("📿 Mantra:")).map((tip, index) => (
              <li key={`mantra-${index}`}>{tip.replace("📿 Mantra: ", "")}</li>
            ))}
          </ul>
        </>
      )}

      {/* Wellness Score */}
      <h3>📊 Wellness Score</h3>
      <div className="wellness-score-bar">
        <div className="score-label">{scoreText}</div>
        <div className="score-bar">
          <div
            className="score-fill"
            style={{
              width: `${scoreValue * 10}%`,
              backgroundColor:
                scoreValue >= 8 ? '#4CAF50' : scoreValue >= 5 ? '#FFC107' : '#F44336',
              height: '10px',
              borderRadius: '5px'
            }}
          ></div>
        </div>
      </div>

      {/* Charts and History */}
      <WellnessHistory history={uniqueHistory} />
      <div style={{ marginTop: '40px', marginBottom: '40px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
        <WellnessProgressChart history={uniqueHistory} />
      </div>

      <div style={{ marginTop: '40px', marginBottom: '40px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
        <ChakraJourneyChart wellnessHistory={uniqueHistory} />
      </div>

      <div style={{ marginTop: '40px', marginBottom: '40px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
        <JournalToneChart wellnessHistory={uniqueHistory} />
      </div>

      {/* Wellness Mirror Summary */}
      <div className="mirror-summary-card">
        <h2 className="mirror-heading">🪞 Wellness Mirror Summary</h2>
        <div className="mirror-body">
          {summary.split('. ').map((line, index) => (
            <p key={index} className="mirror-line"> {line.trim()}.</p>
          ))}
        </div>
      </div>

      {/* Medical Advisory */}
      {hasDisease === "true" && (
        <div style={{ marginTop: '24px', backgroundColor: '#fff3f3', padding: '16px', borderRadius: '8px' }}>
          <h4>🩺 Important Health Note</h4>
          <p style={{ color: '#b00020', fontWeight: '500' }}>
            You’ve indicated a medical condition. Please consult your doctor before starting any new physical activity.  
            While we offer gentle guidance rooted in wellness traditions, your safety and medical care are the highest priority.
          </p>
        </div>
      )}

      {/* Gentle Invitation */}
      <h3>🌿 Your Next Step</h3>
      <p className="next-step">
        If you're curious about how yoga can support your wellness journey—whether through group sessions or personalized guidance—we’d love to hear from you.<br />
        You don’t need to be flexible or experienced. You just need to begin.<br />
        Based on your wellness insights, yoga may offer the support your body and mind are asking for.<br />
        Whether you prefer a group session or a personalized practice, we’re here to guide you with care and respect for your unique rhythm.<br />
        📩 Reach out anytime at <a href="mailto:support@yogdhara.com">support@yogdhara.com</a> to explore what might suit your rhythm. We’d be happy to connect.
      </p>
    </>
  );
};

export default WellnessRender;