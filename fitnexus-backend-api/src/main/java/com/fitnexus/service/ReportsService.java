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

@Service
public class ReportsService {

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
			// ── Sleep ────────────────────────────────────────────────────
			if (input.getSleepHours() != null && input.getSleepHours() < 6) {
				score -= 2;
				sleepTips.add("🌙 Practice Yoga Nidra and avoid screens before sleep.");
			}
			String sleepQ = input.getSleepQuality();
			if ("Insomnia".equalsIgnoreCase(sleepQ) || "DreamDisturbed".equalsIgnoreCase(sleepQ)) {
				score -= 1;
				sleepTips.add("🌙 Insomnia pattern detected — Try Shavasana, Legs-up-the-Wall, and herbal tea before bed.");
			} else if ("Interrupted".equalsIgnoreCase(sleepQ) || "LightSleep".equalsIgnoreCase(sleepQ)) {
				sleepTips.add("🌙 Light or interrupted sleep — Establish a consistent sleep schedule and practice 4-7-8 breathing.");
			}

			// ── Stress ───────────────────────────────────────────────────
			if (input.getStressLevel() != null && input.getStressLevel() > 7) {
				score -= 3;
				tips.add("🧘 Severe stress detected — Yoga Nidra, guided meditation, and Anulom-Vilom pranayama are recommended.");
			} else if (input.getStressLevel() != null && input.getStressLevel() > 5) {
				score -= 1;
				tips.add("😌 Moderate stress can be eased with restorative yoga and mindful pauses.");
			}

			// ── Water ────────────────────────────────────────────────────
			if (input.getWaterIntake() != null && input.getWaterIntake() < 2.0) {
				score -= 1;
				hydrationTips.add("💧 Your water intake is below optimal — aim for 2–3L daily for digestion and energy.");
			} else {
				hydrationTips.add("💧 Good hydration level — keep up the " + (input.getWaterIntake() != null ? input.getWaterIntake() : 2.0) + "L daily intake.");
			}

			// ── Heart Rate ───────────────────────────────────────────────
			Integer hr = input.getRestingHeartRate();
			if (hr != null && hr > 0) {
				if (hr >= 60 && hr <= 100) {
					hydrationTips.add("❤️ Resting heart rate (" + hr + " bpm) is within normal range — great job!");
				} else if (hr < 60) {
					hydrationTips.add("❤️ Low resting heart rate (" + hr + " bpm) — if you're not an athlete, consult a doctor.");
				} else {
					hydrationTips.add("❤️ Elevated heart rate (" + hr + " bpm) — practice Shavasana and deep abdominal breathing daily.");
					score -= 1;
				}
			}

			// ── Pain Area ────────────────────────────────────────────────
			String pain = input.getPainArea();
			if (pain != null && !"None".equalsIgnoreCase(pain) && !pain.isEmpty()) {
				score -= 2;
				switch (pain.toLowerCase()) {
					case "neck": tips.add("🧍 Neck pain — Try Griva Sanchalana, shoulder rolls, and Makarasana."); break;
					case "back": tips.add("🧍 Back pain — Try Kati Sanchalana, Bhujangasana, and Shalabhasana."); break;
					case "joints": tips.add("🧍 Joint pain — Practice Sukshma Vyayama and Pawanmuktasana Part 1."); break;
					case "shoulder": tips.add("🧍 Shoulder pain — Practice Skandha Sanchalana, Gomukhasana."); break;
					case "knee": tips.add("🧍 Knee discomfort — Gentle Pawanmuktasana and Virasana with support."); break;
					default: tips.add("🧍 Pain in " + pain + " — Consult a yoga therapist for targeted asana guidance."); break;
				}
			}

			// ── Mood Insight ─────────────────────────────────────────────
			if (mood != null) {
				switch (mood.toLowerCase()) {
					case "lonely":
						moodInsight = "You've shared that you're feeling lonely. This emotion often arises when we feel disconnected—not just from others, but sometimes from ourselves. Movement can be a bridge. Group yoga, mantra chanting, or even a shared breath practice can gently remind you that you are never truly alone.";
						chakra = "Heart";
						tips.add("🤝 Reconnect through group yoga sessions or spiritual chanting circles (Satsang).");
						break;
					case "stressed":
						moodInsight = "Stress is your body's signal asking for rest and attention. You are not failing — you are feeling. Nadi Shodhana pranayama and grounding practices can help create space between stimulus and response.";
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
						moodInsight = "Your emotional state is a gift — both to yourself and to those around you. Maintain this radiance with 10 minutes of gratitude meditation each morning.";
						chakra = "Crown";
						tips.add("✨ Maintain your beautiful emotional state with 10 min daily gratitude meditation.");
						break;
					default:
						moodInsight = "Your mood is a window into your inner world. Continue to observe and honor what arises.";
						chakra = "Third Eye";
						break;
				}
			}

			// ── Energy Level ─────────────────────────────────────────────
			String energy = input.getEnergyLevel();
			if (energy != null) {
				if ("Hyperactive".equalsIgnoreCase(energy) || "High".equalsIgnoreCase(energy)) {
					tips.add("⚡ High energy — Ground with slow-flow yoga and Chandra Namaskar (Moon Salutation).");
				} else if ("Low".equalsIgnoreCase(energy) || "Fatigued".equalsIgnoreCase(energy)) {
					tips.add("🔋 Low energy — Energize with Surya Namaskar and Kapalabhati pranayama.");
				}
			}

			// ── Digestive ────────────────────────────────────────────────
			String digestion = input.getDigestiveIssues();
			if (digestion != null && !"None".equalsIgnoreCase(digestion) && !digestion.isEmpty()) {
				tips.add("🫄 Digestive issues — Try Pawanmuktasana, Vajrasana after meals, and gentle abdominal twists.");
			}

			// ── Social / Spiritual / Environmental ───────────────────────
			if ("no".equalsIgnoreCase(input.getSocialSupport())) {
				score -= 1;
				tips.add("🤝 Low social support noted — Consider joining a community yoga class or wellness group.");
			}
			if ("no".equalsIgnoreCase(input.getInnerPeace())) {
				score -= 1;
				tips.add("☮️ Inner peace practice suggested — Try 5-minute morning stillness and gratitude journaling daily.");
			}
			if (input.getWithNature() != null && input.getWithNature() < 1) {
				tips.add("🌿 Spend at least 15–30 minutes daily in nature — barefoot on grass or sitting under a tree.");
			}
			if (input.getWorkSatisfaction() != null && input.getWorkSatisfaction() < 5) {
				score -= 1;
				tips.add("💼 Low work satisfaction — Set clear work-life boundaries and do 5-minute desk stretches every 2 hours.");
			}

			// ── Medical ──────────────────────────────────────────────────
			if (Boolean.TRUE.equals(input.getHasDisease())) {
				medicalAdvisory = "⚠️ Medical condition flagged — Please consult an AYUSH-certified doctor or yoga therapist before starting any new practice.";
				tips.add("🏥 Consult an AYUSH doctor for restorative yoga programs tailored to your medical history.");
			}

			// ── Journal Reflection ───────────────────────────────────────
			String journal = input.getJournalEntry();
			if (journal != null && !journal.trim().isEmpty()) {
				journalReflection = "You're observing your inner world. Let's deepen that awareness with meditative movement and stillness. Suggestion: Try seated meditation and Trataka to enhance clarity.";
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
			// Compute BMI from height/weight if not already stored
			double storedBmi = input.getBmi();
			if (storedBmi <= 0 && input.getHeight() > 0 && input.getWeight() > 0) {
				double hm = input.getHeight() / 100.0;
				storedBmi = Math.round((input.getWeight() / (hm * hm)) * 10.0) / 10.0;
			}
			report.setBmi(storedBmi);
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

		User user = userRepo.findById(userId).orElse(null);
		if (user != null) {
			report.setStaffNotes(user.getStaffNotes());
		}

		return report;
	}
}