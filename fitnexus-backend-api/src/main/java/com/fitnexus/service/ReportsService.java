package com.fitnexus.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fitnexus.dto.WellnessReport;
import com.fitnexus.entity.Nutrition;
import com.fitnexus.entity.Sleep;
import com.fitnexus.entity.Stress;
import com.fitnexus.entity.WellnessInput;
import com.fitnexus.entity.Workout;
import com.fitnexus.entity.User;
import com.fitnexus.repository.NutritionRepository;
import com.fitnexus.repository.SleepRepository;
import com.fitnexus.repository.StressRepository;
import com.fitnexus.repository.WellnessInputRepository;
import com.fitnexus.repository.WorkoutRepository;
import com.fitnexus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

@Service
public class ReportsService {

	@Value("${gemini.api.key}")
	private String geminiApiKey;

	@Value("${gemini.model}")
	private String geminiModel;

	private final RestTemplate restTemplate = new RestTemplate();
	private final ObjectMapper objectMapper = new ObjectMapper();

	private String callGeminiAPI(String promptText) {
		if (geminiApiKey == null || geminiApiKey.trim().isEmpty() || geminiApiKey.contains("YOUR_KEY")) {
			return null;
		}
		try {
			String url = "https://generativelanguage.googleapis.com/v1beta/models/" + geminiModel + ":generateContent?key=" + geminiApiKey;

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);

			// JSON request payload for Gemini
			String jsonPayload = "{"
					+ "  \"contents\": [{"
					+ "    \"parts\": [{"
					+ "      \"text\": \"" + escapeJson(promptText) + "\""
					+ "    }]"
					+ "  }],"
					+ "  \"generationConfig\": {"
					+ "    \"responseMimeType\": \"application/json\""
					+ "  }"
					+ "}";

			HttpEntity<String> entity = new HttpEntity<>(jsonPayload, headers);
			ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

			if (response.getStatusCode().is2xxSuccessful()) {
				JsonNode root = objectMapper.readTree(response.getBody());
				JsonNode candidates = root.path("candidates");
				if (candidates.isArray() && candidates.size() > 0) {
					JsonNode textNode = candidates.get(0)
							.path("content")
							.path("parts")
							.get(0)
							.path("text");
					return textNode.asText();
				}
			}
		} catch (Exception e) {
			System.err.println("Gemini API call failed: " + e.getMessage());
		}
		return null;
	}

	private String escapeJson(String text) {
		if (text == null) return "";
		return text.replace("\\", "\\\\")
				.replace("\"", "\\\"")
				.replace("\b", "\\b")
				.replace("\f", "\\f")
				.replace("\n", "\\n")
				.replace("\r", "\\r")
				.replace("\t", "\\t");
	}

	@Autowired private WorkoutRepository workoutRepo;
	@Autowired private NutritionRepository nutritionRepo;
	@Autowired private SleepRepository sleepRepo;
	@Autowired private StressRepository stressRepo;
	@Autowired private WellnessInputRepository wellnessInputRepo;
	@Autowired private UserRepository userRepo;

	public WellnessReport generateReport(Long userId) {
		List<Workout>   workouts  = workoutRepo.findByUserId(userId);
		List<Nutrition> meals     = nutritionRepo.findByUserId(userId);
		List<Sleep>     sleeps    = sleepRepo.findByUserId(userId);
		List<Stress>    stresses  = stressRepo.findByUserId(userId);
		WellnessInput   input     = wellnessInputRepo.findByUserId(userId).orElse(null);

		// ─── Log Summaries ────────────────────────────────────────────────
		String workoutSummary = workouts.size() > 0
				? "Total workouts logged: " + workouts.size()
				: (input != null && input.getWorkoutDuration() != null && input.getWorkoutDuration() > 0
						? "Workout: " + input.getWorkoutDuration() + " mins, " + (input.getWorkoutFrequency() != null ? input.getWorkoutFrequency() : 0) + " times/week (" + input.getWorkoutType() + ")."
						: "No workouts logged yet.");

		String nutritionSummary = meals.size() > 0
				? "Meals logged: " + meals.size()
				: (input != null && input.getDailyCalories() != null && input.getDailyCalories() > 0
						? "Nutrition: " + input.getDailyCalories() + " kcal, Protein: " + (input.getProteinIntake() != null ? input.getProteinIntake() : 0) + "g."
						: "No meals logged yet.");

		double avgSleep = sleeps.stream().mapToInt(Sleep::getHours).average()
				.orElse(input != null && input.getSleepHours() != null ? input.getSleepHours() : 0.0);
		String sleepSummary = "Average sleep: " + String.format("%.1f", avgSleep) + " hrs"
				+ (input != null && input.getSleepQuality() != null ? " (Quality: " + input.getSleepQuality() + ")" : "");

		String stressSummary = stresses.size() > 0
				? "Stress logs: " + stresses.size() + " entries."
				: (input != null && input.getStressLevel() != null && input.getStressLevel() > 0
						? "Stress Level: " + input.getStressLevel() + "/10" + (input.getStressTriggers() != null && !input.getStressTriggers().isEmpty() ? " (Triggers: " + input.getStressTriggers() + ")" : "")
						: "No stress entries logged.");

		// ─── YCB Wellness Score (1–10) ────────────────────────────────────
		int score = 10;
		List<String> tips         = new ArrayList<>();
		List<String> sleepTips    = new ArrayList<>();
		List<String> hydrationTips= new ArrayList<>();
		String yogaRecommendation = "";
		String mantra             = "";
		String affirmation        = "";
		String moodInsight        = "";
		String journalReflection  = "";
		String chakra             = "Crown";
		String medicalAdvisory    = null;
		String mood               = input != null ? input.getMood() : null;

		if (input != null) {
			// ── BMI Deduction ────────────────────────────────────────────
			if (input.getHeight() > 0 && input.getWeight() > 0) {
				double hm = input.getHeight() / 100.0;
				double calculatedBmiVal = input.getWeight() / (hm * hm);
				if (calculatedBmiVal >= 30.0) {
					score -= 2;
					tips.add("💡 Obese BMI (" + String.format("%.1f", calculatedBmiVal) + ") — Caloric deficit, brisk walking & dynamic Vinyasa flow advised.");
				} else if (calculatedBmiVal >= 25.0) {
					score -= 1;
					tips.add("💡 Overweight BMI (" + String.format("%.1f", calculatedBmiVal) + ") — Combine 12 rounds of Surya Namaskar daily with a light sattvic diet.");
				} else if (calculatedBmiVal < 18.5) {
					score -= 1;
					tips.add("💡 Underweight BMI (" + String.format("%.1f", calculatedBmiVal) + ") — Focus on nutrient-dense meals and grounding Hatha yoga poses.");
				}
			}

			// ── Mood Deduction ───────────────────────────────────────────
			if (mood != null) {
				String ml = mood.toLowerCase();
				if (ml.contains("anxious") || ml.contains("sad") || ml.contains("lonely") || ml.contains("stressed") || ml.contains("angry") || ml.contains("irritable")) {
					score -= 1;
				}
				switch (ml) {
					case "lonely":
						moodInsight = "You've shared that you're feeling lonely. This emotion often arises when we feel disconnected. Movement can be a bridge. Group yoga, mantra chanting, or even a shared breath practice can gently remind you that you are connected.";
						chakra = "Heart";
						tips.add("🤝 Reconnect through group yoga sessions or spiritual chanting circles (Satsang).");
						break;
					case "stressed":
						moodInsight = "Stress is your body's signal asking for rest and attention. Nadi Shodhana pranayama and grounding practices can help create space between stimulus and response.";
						chakra = "Solar Plexus";
						tips.add("🌬️ Try Nadi Shodhana (alternate nostril breathing) for deep nervous system calming.");
						break;
					case "anxious":
						moodInsight = "Anxiety often lives in the future. Bring yourself back to this breath, this moment. Ujjayi breathing and slow, mindful movement are powerful anchors for an anxious mind.";
						chakra = "Root";
						tips.add("🫧 Ground your energy with slow, mindful movement and Ujjayi breathing.");
						break;
					case "sad":
						moodInsight = "Sadness is not weakness — it is depth. Let yourself feel without judgment. Heart-opening postures like Bhujangasana and chanting can gently lift the emotional veil.";
						chakra = "Heart";
						tips.add("🌸 Try Surya Namaskar and uplifting Bhajan chanting to reconnect with joy.");
						break;
					case "angry":
					case "irritable":
						moodInsight = "Anger holds a message — listen to it with compassion. Channel its intensity through movement. Simhasana (Lion Pose) and cooling Sheetali pranayama can release heat and restore clarity.";
						chakra = "Throat";
						tips.add("🔥 Channel intensity into Simhasana (Lion Pose) and Sheetali pranayama for cooling.");
						break;
					case "calm":
					case "joyful":
					case "grateful":
					case "hopeful":
						moodInsight = "Your emotional state is a gift — maintain this radiance with 10 minutes of gratitude meditation each morning.";
						chakra = "Crown";
						tips.add("✨ Maintain your emotional balance with 10 min daily gratitude meditation.");
						break;
					default:
						moodInsight = "Your mood is a window into your inner world. Continue to observe and honor what arises.";
						chakra = "Third Eye";
						break;
				}
			}

			// ── Energy Level Deduction ───────────────────────────────────
			String energy = input.getEnergyLevel();
			if (energy != null) {
				if ("Low".equalsIgnoreCase(energy) || "Fatigued".equalsIgnoreCase(energy)) {
					score -= 1;
					tips.add("🔋 Low energy / Fatigue — Energize with Surya Namaskar, Kapalabhati pranayama, and iron-rich sattvic foods.");
				} else if ("Hyperactive".equalsIgnoreCase(energy) || "High".equalsIgnoreCase(energy)) {
					tips.add("⚡ High energy — Ground with slow-flow yoga and Chandra Namaskar (Moon Salutation).");
				}
			}

			// ── Sleep ────────────────────────────────────────────────────
			if (input.getSleepHours() != null && input.getSleepHours() < 6) {
				score -= 2;
				sleepTips.add("🌙 Short sleep duration (" + input.getSleepHours() + "h) — Practice Yoga Nidra and avoid screens 1 hour before sleep.");
			} else if (input.getSleepHours() != null && input.getSleepHours() < 7) {
				score -= 1;
				sleepTips.add("🌙 Aim for 7–8 hours of restful sleep daily.");
			}
			String sleepQ = input.getSleepQuality();
			if ("Insomnia".equalsIgnoreCase(sleepQ) || "DreamDisturbed".equalsIgnoreCase(sleepQ)) {
				score -= 1;
				sleepTips.add("🌙 Insomnia pattern detected — Try Shavasana, Legs-up-the-Wall (Viparita Karani), and warm chamomile tea.");
			} else if ("Interrupted".equalsIgnoreCase(sleepQ) || "LightSleep".equalsIgnoreCase(sleepQ)) {
				sleepTips.add("🌙 Light or interrupted sleep — Establish a consistent bedtime and practice 4-7-8 breathing.");
			}

			// ── Stress ───────────────────────────────────────────────────
			if (input.getStressLevel() != null && input.getStressLevel() > 7) {
				score -= 3;
				tips.add("🧘 Severe stress detected (" + input.getStressLevel() + "/10) — Yoga Nidra, guided meditation, and Anulom-Vilom pranayama are strongly recommended.");
			} else if (input.getStressLevel() != null && input.getStressLevel() >= 5) {
				score -= 1;
				tips.add("😌 Moderate stress (" + input.getStressLevel() + "/10) — Can be eased with restorative yoga and mindful 5-minute pauses.");
			}

			// ── Water ────────────────────────────────────────────────────
			if (input.getWaterIntake() != null && input.getWaterIntake() < 2.0) {
				score -= 1;
				hydrationTips.add("💧 Water intake (" + input.getWaterIntake() + "L) is below optimal — aim for 2–3L daily for digestion and energy.");
			} else {
				hydrationTips.add("💧 Good hydration level — keep up the " + (input.getWaterIntake() != null ? input.getWaterIntake() : 2.0) + "L daily intake.");
			}

			// ── Heart Rate ───────────────────────────────────────────────
			Integer hr = input.getRestingHeartRate();
			if (hr != null && hr > 0) {
				if (hr >= 60 && hr <= 100) {
					hydrationTips.add("❤️ Resting heart rate (" + hr + " bpm) is within normal range — great job!");
				} else if (hr < 60) {
					hydrationTips.add("❤️ Low resting heart rate (" + hr + " bpm) — if not an endurance athlete, consult a doctor.");
				} else {
					hydrationTips.add("❤️ Elevated heart rate (" + hr + " bpm) — practice Shavasana and deep abdominal breathing daily.");
					score -= 1;
				}
			}

			// ── Targeted Pain Area Asanas ────────────────────────────────
			String pain = input.getPainArea();
			if (pain != null && !"None".equalsIgnoreCase(pain) && !pain.trim().isEmpty()) {
				score -= 1;
				switch (pain.toLowerCase()) {
					case "back":
						tips.add("🧘 Targeted Back Pain Asanas: Marjaryasana-Bitilasana (Cat-Cow 10 rounds), Bhujangasana (Cobra Pose), Shalabhasana (Locust), Setu Bandhasana (Bridge Pose).");
						break;
					case "neck":
						tips.add("🧘 Targeted Neck Pain Asanas: Griva Sanchalana (Neck movements), Skandha Chakra (Shoulder socket rotation), Makarasana (Crocodile Pose).");
						break;
					case "knee":
						tips.add("🧘 Targeted Knee Pain Asanas: Pawanmuktasana Part 1 (Anti-rheumatic series), Janu Naman, Supported Virasana with bolster.");
						break;
					case "shoulder":
						tips.add("🧘 Targeted Shoulder Asanas: Skandha Sanchalana, Gomukhasana (Cow Face Arms), Garudasana (Eagle Arms).");
						break;
					case "joints":
						tips.add("🧘 Targeted Joint Pain Asanas: Full Sukshma Vyayama sequence, Pawanmuktasana Part 1, Tadasana.");
						break;
					default:
						tips.add("🧘 Pain in " + pain + " — Practice gentle Sukshma Vyayama and consult a certified yoga therapist.");
						break;
				}
			}

			// ── Social / Spiritual / Environmental / Work ─────────────
			if ("no".equalsIgnoreCase(input.getSocialSupport())) {
				score -= 1;
				tips.add("🤝 Low social support noted — Consider joining a community yoga class or local wellness group.");
			}
			if ("no".equalsIgnoreCase(input.getInnerPeace())) {
				score -= 1;
				tips.add("☮️ Inner peace practice suggested — Try 5-minute morning stillness and gratitude journaling daily.");
			}
			if (input.getWithNature() != null && input.getWithNature() < 2) {
				score -= 1;
				tips.add("🌿 Time in nature is low (" + input.getWithNature() + "h/week) — Spend at least 20–30 minutes daily outdoors or barefoot on grass.");
			}
			if (input.getWorkSatisfaction() != null && input.getWorkSatisfaction() < 5) {
				score -= 1;
				tips.add("💼 Low work satisfaction (" + input.getWorkSatisfaction() + "/10) — Set clear work-life boundaries and do 5-minute desk stretches every 2 hours.");
			}

			// ── Medical ──────────────────────────────────────────────────
			if (Boolean.TRUE.equals(input.getHasDisease()) || (input.getChronicConditions() != null && !input.getChronicConditions().isEmpty() && !"None".equalsIgnoreCase(input.getChronicConditions()))) {
				score -= 1;
				medicalAdvisory = "⚠️ Medical condition flagged — Please consult an AYUSH-certified doctor or physician before starting intensive practices.";
				tips.add("🏥 Consult an AYUSH doctor for restorative yoga programs tailored to your medical history.");
			}

			// ── Dynamic Journal Reflection ───────────────────────────────
			String journal = input.getJournalEntry();
			if (journal != null && !journal.trim().isEmpty()) {
				journalReflection = "You shared: \"" + journal.trim() + "\". Reflecting on your feelings is an empowering step toward emotional clarity. Suggestion: Combine journaling with 5 minutes of Heart-opening Anahata meditation and gentle Sukshma Vyayama.";
			} else {
				journalReflection = "No journal reflection logged today. Taking 2 minutes to write your thoughts can significantly enhance mindfulness.";
			}

			// ── Yoga Recommendation ──────────────────────────────────────
			String exp = input.getYogaExperience();
			boolean isBeginner = exp == null || "Beginner".equalsIgnoreCase(exp);
			boolean isActive   = "Active".equalsIgnoreCase(exp);

			if (isBeginner && input.getStressLevel() != null && input.getStressLevel() > 7) {
				yogaRecommendation = "Yoga Nidra (20 min) + Gentle Breathwork (Anulom-Vilom 10 rounds) + Sukshma Vyayama";
			} else if (isBeginner) {
				yogaRecommendation = "Sukshma Vyayama + Pawanmuktasana Series + Shavasana (10 min)";
			} else if (isActive && input.getStressLevel() != null && input.getStressLevel() > 5) {
				yogaRecommendation = "Surya Namaskar (6 rounds) + Nadi Shodhana + Yoga Nidra (15 min)";
			} else if (isActive) {
				yogaRecommendation = "Surya Namaskar (12 rounds) + Standing Postures + Kapalabhati + Meditation (10 min)";
			} else {
				yogaRecommendation = "Advanced Pranayama (Bhastrika, Kapalabhati) + Shatkarma + Dhyana (20 min) + Advanced Asana Flow";
			}

			// ── Chakra Mantra & Affirmation ──────────────────────────────
			if ((input.getStressLevel() != null && input.getStressLevel() > 7) || "Anxious".equalsIgnoreCase(mood)) {
				mantra      = "ॐ रं नमः (Om Ram Namah) — Manipura Chakra Activation";
				affirmation = "I am strong. I am grounded. I release all fear and embrace inner calm.";
			} else if ("Sad".equalsIgnoreCase(mood) || "Lonely".equalsIgnoreCase(mood)) {
				mantra      = "So Hum – I am That.";
				affirmation = "I am worthy of connection. My breath links me to the world.";
			} else if ("Angry".equalsIgnoreCase(mood) || "Irritable".equalsIgnoreCase(mood)) {
				mantra      = "ॐ हं नमः (Om Ham Namah) — Vishuddha Chakra Activation";
				affirmation = "I speak with clarity and compassion. I release anger and embrace peaceful expression.";
			} else if ("Stressed".equalsIgnoreCase(mood)) {
				mantra      = "ॐ रं नमः (Om Ram Namah) — Manipura Chakra";
				affirmation = "I am balanced. I release tension. Peace flows through me with every breath.";
			} else {
				mantra      = "ॐ (Om) — Universal Mantra for Holistic Wellness";
				affirmation = "I am balanced. I am well. Every breath fills me with vitality and gratitude.";
			}
		}

		// ─── Score Clamp & Status ─────────────────────────────────────────
		if (score < 1) score = 1;
		if (score > 10) score = 10;

		String status;
		if (score >= 8)      status = "Excellent";
		else if (score >= 5) status = "Moderate";
		else                 status = "Needs Attention";

		// ─── AYUSH General Recommendations ───────────────────────────────
		List<String> recs = new ArrayList<>();
		if (workouts.size() < 3 && (input == null || input.getWorkoutFrequency() == null || input.getWorkoutFrequency() < 3))
			recs.add("Increase yoga or physical activity to at least 3 sessions per week.");
		if (avgSleep < 7)
			recs.add("Aim for 7–8 hours of restful sleep. Maintain regular bedtime/wake time.");
		if (meals.size() < 2 && (input == null || input.getDailyCalories() == null || input.getDailyCalories() < 1200))
			recs.add("Ensure balanced sattvic meals with green vegetables, fruits, and proper protein intake.");
		if (stresses.stream().anyMatch(s -> "High".equalsIgnoreCase(s.getLevel()))
				|| (input != null && input.getStressLevel() != null && input.getStressLevel() > 5))
			recs.add("Practice deep pranayama, alternate nostril breathing, or guided meditation daily.");
		if (input != null) {
			if ("Beginner".equalsIgnoreCase(input.getYogaExperience()))
				recs.add("Start with gentle beginner yoga postures (Sukshma Vyayama) and Pawanmuktasana series.");
			if (input.getSleepHours() != null && input.getSleepHours() < 6)
				recs.add("Practice Yoga Nidra for 15–20 minutes in the afternoon to compensate for short sleep.");
		}

		// ─── Caloric Burn Prediction ──────────────────────────────────────
		int predictedCalorieBurn = 0;
		if (input != null && input.getWeight() > 0 && input.getWorkoutDuration() != null && input.getWorkoutDuration() > 0) {
			double weightKg = input.getWeight();
			int durationMins = input.getWorkoutDuration();
			String wType = input.getWorkoutType();
			double met = 4.0; // default MET for moderate activity
			if (wType != null) {
				String wl = wType.toLowerCase();
				if (wl.contains("yoga")) met = 3.0;
				else if (wl.contains("cardio") || wl.contains("run")) met = 8.0;
				else if (wl.contains("strength") || wl.contains("weight") || wl.contains("gym")) met = 6.0;
				else if (wl.contains("walk")) met = 3.5;
			}
			// Calories = (MET * 3.5 * weightKg / 200) * durationMins
			predictedCalorieBurn = (int) Math.round((met * 3.5 * weightKg / 200.0) * durationMins);
		}

		// ─── Stress Trend Prediction ──────────────────────────────────────
		int predictedStressTrend = input != null && input.getStressLevel() != null ? input.getStressLevel() : 5;
		if (input != null) {
			// Deficit or factors that increase stress
			if (input.getSleepHours() != null && input.getSleepHours() < 6) predictedStressTrend += 1;
			if (input.getWorkSatisfaction() != null && input.getWorkSatisfaction() < 5) predictedStressTrend += 1;
			if (input.getRestingHeartRate() != null && input.getRestingHeartRate() > 85) predictedStressTrend += 1;
			// Factors that reduce stress
			if (input.getWithNature() != null && input.getWithNature() > 4) predictedStressTrend -= 1;
			if (input.getMeditationMinutes() > 15) predictedStressTrend -= 1;
			if ("yes".equalsIgnoreCase(input.getInnerPeace())) predictedStressTrend -= 1;
			// Clamp stress prediction to 1-10
			if (predictedStressTrend < 1) predictedStressTrend = 1;
			if (predictedStressTrend > 10) predictedStressTrend = 10;
		}

		// ─── Sleep Quality Score Prediction ───────────────────────────────
		int predictedSleepQuality = 70; // baseline sleep score
		if (input != null) {
			double sleepHours = input.getSleepHours() != null ? input.getSleepHours() : 8.0;
			// Sleep duration component (up to 40 points)
			if (sleepHours >= 7 && sleepHours <= 9) predictedSleepQuality += 30;
			else if (sleepHours > 9) predictedSleepQuality += 15;
			else predictedSleepQuality += (int) (sleepHours * 4); // lower score for less sleep

			// Sleep quality subjective input (up to 30 points)
			String sq = input.getSleepQuality();
			if ("Restful".equalsIgnoreCase(sq)) predictedSleepQuality += 30;
			else if ("LightSleep".equalsIgnoreCase(sq) || "Interrupted".equalsIgnoreCase(sq)) predictedSleepQuality += 15;
			else if ("Insomnia".equalsIgnoreCase(sq)) predictedSleepQuality += 5;

			// Disruptive factors
			if (input.getStressLevel() != null && input.getStressLevel() > 7) predictedSleepQuality -= 15;
			if (input.getWorkSatisfaction() != null && input.getWorkSatisfaction() < 5) predictedSleepQuality -= 5;
			if (input.getRestingHeartRate() != null && input.getRestingHeartRate() > 80) predictedSleepQuality -= 5;

			// Clamp sleep score to 0-100
			if (predictedSleepQuality < 0) predictedSleepQuality = 0;
			if (predictedSleepQuality > 100) predictedSleepQuality = 100;
		}

		// Compute BMI helper value
		double calculatedBmi = 22.0;
		if (input != null && input.getHeight() > 0 && input.getWeight() > 0) {
			double hm = input.getHeight() / 100.0;
			calculatedBmi = Math.round((input.getWeight() / (hm * hm)) * 10.0) / 10.0;
		}

		// ─── GenAI Call ───────────────────────────────────────────────────
		if (input != null && geminiApiKey != null && !geminiApiKey.trim().isEmpty() && !geminiApiKey.contains("YOUR_KEY")) {
			String prompt = "Evaluate this wellness assessment data and return a JSON object. "
					+ "The user's metrics: "
					+ "Name: " + (input.getFullName() != null ? input.getFullName() : "User") + ", "
					+ "Age: " + input.getAge() + ", "
					+ "Gender: " + input.getGender() + ", "
					+ "City: " + input.getCity() + ", "
					+ "Height/Weight: " + input.getHeight() + "cm / " + input.getWeight() + "kg (BMI: " + calculatedBmi + "), "
					+ "Water Intake: " + input.getWaterIntake() + "L/day, "
					+ "Resting Heart Rate: " + input.getRestingHeartRate() + " BPM, "
					+ "Sleep Duration/Quality: " + input.getSleepHours() + " hours / " + input.getSleepQuality() + ", "
					+ "Mood: " + input.getMood() + ", "
					+ "Energy: " + input.getEnergyLevel() + ", "
					+ "Stress Level: " + input.getStressLevel() + "/10 (Triggers: " + input.getStressTriggers() + "), "
					+ "Inner Peace: " + input.getInnerPeace() + ", "
					+ "Social Support: " + input.getSocialSupport() + ", "
					+ "Work Satisfaction: " + input.getWorkSatisfaction() + "/10, "
					+ "Nature Time: " + input.getWithNature() + " hours/week, "
					+ "Medical Disease: " + input.getHasDisease() + " (Conditions: " + input.getChronicConditions() + ", Meds: " + input.getMedications() + "), "
					+ "Journal Entry: \\\"" + (input.getJournalEntry() != null ? input.getJournalEntry() : "") + "\\\", "
					+ "Yoga Experience: " + input.getYogaExperience() + ", "
					+ "Workout Type/Duration/Freq: " + input.getWorkoutType() + " / " + input.getWorkoutDuration() + " mins / " + input.getWorkoutFrequency() + " times/week. "
					+ "Return ONLY a JSON object containing keys: 'moodInsight' (text explaining emotional reflection), 'affirmation' (uplifting text), 'mantra' (traditional sanskrit/hindi mantra corresponding to chakra/mood), 'yogaRecommendation' (sanskrit/standard names of poses/breathwork/time recommended), 'journalReflection' (text reflecting on their journal), 'sleepTips' (array of strings), 'hydrationTips' (array of strings), 'wellnessTips' (array of strings), 'recommendations' (array of strings inspired by holistic lifestyle concepts without government or AYUSH branding).";

			String geminiJson = callGeminiAPI(prompt);
			if (geminiJson != null && !geminiJson.trim().isEmpty()) {
				try {
					JsonNode geminiData = objectMapper.readTree(geminiJson);
					if (geminiData.has("moodInsight")) moodInsight = geminiData.path("moodInsight").asText();
					if (geminiData.has("affirmation")) affirmation = geminiData.path("affirmation").asText();
					if (geminiData.has("mantra")) mantra = geminiData.path("mantra").asText();
					if (geminiData.has("yogaRecommendation")) yogaRecommendation = geminiData.path("yogaRecommendation").asText();
					if (geminiData.has("journalReflection")) journalReflection = geminiData.path("journalReflection").asText();

					if (geminiData.has("sleepTips") && geminiData.path("sleepTips").isArray()) {
						sleepTips.clear();
						for (JsonNode node : geminiData.path("sleepTips")) {
							sleepTips.add(node.asText());
						}
					}
					if (geminiData.has("hydrationTips") && geminiData.path("hydrationTips").isArray()) {
						hydrationTips.clear();
						for (JsonNode node : geminiData.path("hydrationTips")) {
							hydrationTips.add(node.asText());
						}
					}
					if (geminiData.has("wellnessTips") && geminiData.path("wellnessTips").isArray()) {
						tips.clear();
						for (JsonNode node : geminiData.path("wellnessTips")) {
							tips.add(node.asText());
						}
					}
					if (geminiData.has("recommendations") && geminiData.path("recommendations").isArray()) {
						recs.clear();
						for (JsonNode node : geminiData.path("recommendations")) {
							recs.add(node.asText());
						}
					}
				} catch (Exception e) {
					System.err.println("Error parsing Gemini JSON response: " + e.getMessage());
				}
			}
		}

		// ─── Build Report ─────────────────────────────────────────────────
		WellnessReport report = new WellnessReport(workoutSummary, nutritionSummary, sleepSummary, stressSummary, recs);

		// Personal info
		if (input != null) {
			report.setFullName(input.getFullName());
			report.setEmail(input.getEmail());
			report.setMobileNumber(input.getMobileNumber());
			report.setGender(input.getGender());
			report.setCity(input.getCity());
			report.setAge(input.getAge());
			report.setHeight(input.getHeight());
			report.setWeight(input.getWeight());
			report.setWaterIntake(input.getWaterIntake());
			report.setDigestiveIssues(input.getDigestiveIssues());
			report.setPainArea(input.getPainArea());
			report.setRestingHeartRate(input.getRestingHeartRate());
			report.setSleepHours(input.getSleepHours());
			report.setSleepQuality(input.getSleepQuality());
			report.setMood(input.getMood());
			report.setEnergyLevel(input.getEnergyLevel());
			report.setStressLevel(input.getStressLevel());
			report.setStressTriggers(input.getStressTriggers());
			report.setInnerPeace(input.getInnerPeace());
			report.setBedtime(input.getBedtime());
			report.setWakeTime(input.getWakeTime());
			report.setYogaExperience(input.getYogaExperience());
			report.setWorkoutType(input.getWorkoutType());
			report.setWorkoutDuration(input.getWorkoutDuration());
			report.setWorkoutFrequency(input.getWorkoutFrequency());
			report.setDaysPerWeek(input.getDaysPerWeek());
			report.setMinutesPerSession(input.getMinutesPerSession());
			report.setMeditationMinutes(input.getMeditationMinutes());
			report.setSocialSupport(input.getSocialSupport());
			report.setWorkSatisfaction(input.getWorkSatisfaction());
			report.setWithNature(input.getWithNature());
			report.setHasDisease(input.getHasDisease());
			report.setChronicConditions(input.getChronicConditions());
			report.setMedications(input.getMedications());
			report.setJournalEntry(input.getJournalEntry());
			report.setBmi(calculatedBmi);
		}

		// Engine outputs
		report.setScore(score);
		report.setStatus(status);
		report.setMantra(mantra);
		report.setAffirmation(affirmation);
		report.setYogaRecommendation(yogaRecommendation);
		report.setMoodInsight(moodInsight);
		report.setJournalReflection(journalReflection);
		report.setChakra(chakra);
		report.setMedicalAdvisory(medicalAdvisory);
		report.setWellnessTips(tips);
		report.setSleepTips(sleepTips);
		report.setHydrationTips(hydrationTips);

		// Set Predictive scores
		report.setPredictedCalorieBurn(predictedCalorieBurn);
		report.setPredictedStressTrend(predictedStressTrend);
		report.setPredictedSleepQuality(predictedSleepQuality);

		User user = userRepo.findById(userId).orElse(null);
		if (user != null) {
			report.setStaffNotes(user.getStaffNotes());
		}

		return report;
	}
}