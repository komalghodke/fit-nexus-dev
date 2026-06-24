export function generateWellnessResponse(data) {
  // Simple scoring logic — extend later
  const score = Math.min(10, Math.round((data.sleepHours || 7) + (data.energyLevel === "High" ? 3 : 1)));
  const affirmation = "You are growing stronger each day.";
  const mantra = "Om Shanti Shanti Shanti";

  return { score, affirmation, mantra };
}
