export const calculateWellnessScore = ({
  mood,
  energy,
  sleep,
  stressLevel,
  painArea,
  sleepHours,
  waterIntake,
  heartRate
}) => {
  let score = 0;

  if (sleep === "Restful") score += 2;
  if (energy === "Balanced") score += 2;
  if (mood === "Joyful" || mood === "Calm") score += 2;
  if (!painArea || painArea === "None") score += 2;
  if (sleepHours >= 7) score += 2;
  if (waterIntake >= 2) score += 1;
  if (heartRate >= 60 && heartRate <= 90) score += 1;
  if (stressLevel === "None" || stressLevel === "Mild") score += 1;

  return score;
};