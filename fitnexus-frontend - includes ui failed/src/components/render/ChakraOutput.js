import React from 'react';
//import '../../styles/ChakraOutput.css'; // Optional for styling

export default function ChakraOutput({ chakra, affirmation, mantra, practice }) {
  const chakraDescriptions = {
    root: {
      name: "Root Chakra (Muladhara)",
      explanation: "The Root Chakra governs safety, grounding, and physical stability. The mantra 'Lam' helps you reconnect with your breath and body, especially during times of anxiety or emotional disconnection."
    },
    sacral: {
      name: "Sacral Chakra (Svadhisthana)",
      explanation: "The Sacral Chakra supports emotional flow, creativity, and sensuality. Chanting 'Vam' helps release numbness and restore emotional vitality."
    },
    solar: {
      name: "Solar Plexus Chakra (Manipura)",
      explanation: "The Solar Plexus Chakra fuels confidence, decision-making, and inner fire. 'Ram' activates your core strength and clears indecision."
    },
    heart: {
      name: "Heart Chakra (Anahata)",
      explanation: "The Heart Chakra opens you to love, compassion, and healing. 'Yam' softens emotional walls and invites connection."
    },
    throat: {
      name: "Throat Chakra (Vishuddha)",
      explanation: "The Throat Chakra empowers expression and truth. 'Ham' clears blockages and helps you speak with clarity and confidence."
    },
    thirdEye: {
      name: "Third Eye Chakra (Ajna)",
      explanation: "The Third Eye Chakra enhances intuition, insight, and clarity. 'Om' awakens inner wisdom and supports deep reflection."
    },
    crown: {
      name: "Crown Chakra (Sahasrara)",
      explanation: "The Crown Chakra connects you to divine consciousness and universal energy. Silence or 'Om' invites peace, surrender, and spiritual alignment."
    }
  };

  const chakraInfo = chakraDescriptions[chakra?.toLowerCase()];

  return (
    <div className="chakra-section">
      {chakraInfo && (
        <>
          <h4>🌀 Chakra Activated: {chakraInfo.name}</h4>
          <p className="chakra-explanation">{chakraInfo.explanation}</p>
        </>
      )}
      <p className="affirmation-block">{affirmation}</p>
    </div>
  );
}