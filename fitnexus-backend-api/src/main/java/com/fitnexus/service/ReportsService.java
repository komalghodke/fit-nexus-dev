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
import com.fitnexus.repository.NutritionRepository;
import com.fitnexus.repository.SleepRepository;
import com.fitnexus.repository.StressRepository;
import com.fitnexus.repository.WellnessInputRepository;
import com.fitnexus.repository.WorkoutRepository;

@Service
public class ReportsService {

	@Autowired
	private WorkoutRepository workoutRepo;
	@Autowired
	private NutritionRepository nutritionRepo;
	@Autowired
	private SleepRepository sleepRepo;
	@Autowired
	private StressRepository stressRepo;

	// ReportsService.java
	@Autowired
	private WellnessInputRepository wellnessInputRepo;

	public WellnessReport generateReport(Long userId) {
		// Fetch logs
		List<Workout> workouts = workoutRepo.findByUserId(userId);
		List<Nutrition> meals = nutritionRepo.findByUserId(userId);
		List<Sleep> sleeps = sleepRepo.findByUserId(userId);
		List<Stress> stresses = stressRepo.findByUserId(userId);

		// Fetch questionnaire
		WellnessInput input = wellnessInputRepo.findByUserId(userId).orElse(null);

		// Fallback Summaries
		String workoutSummary = workouts.size() > 0 
				? "Total workouts logged: " + workouts.size() 
				: (input != null && input.getWorkoutDuration() > 0 
					? "Workout: " + input.getWorkoutDuration() + " mins, " + input.getWorkoutFrequency() + " times/week (" + input.getWorkoutType() + ")."
					: "No workouts logged yet.");

		String nutritionSummary = meals.size() > 0 
				? "Meals logged: " + meals.size() 
				: (input != null && input.getDailyCalories() > 0 
					? "Nutrition: " + input.getDailyCalories() + " kcal, Protein: " + input.getProteinIntake() + "g."
					: "No meals logged yet.");

		double avgSleep = sleeps.stream().mapToInt(Sleep::getHours).average()
				.orElse(input != null ? input.getSleepHours() : 0.0);
		String sleepSummary = "Average sleep: " + avgSleep + " hrs" 
				+ (input != null && input.getSleepQuality() != null ? " (Quality: " + input.getSleepQuality() + ")" : "");

		String stressSummary = stresses.size() > 0 
				? "Stress logs: " + stresses.size() + " entries."
				: (input != null && input.getStressLevel() > 0 
					? "Stress Level: " + input.getStressLevel() + "/10 (Triggers: " + input.getStressTriggers() + ")"
					: "No stress entries logged.");

		List<String> recs = new ArrayList<>();
		if (workouts.size() < 3 && (input == null || input.getWorkoutFrequency() < 3))
			recs.add("Increase yoga or physical activity to at least 3 sessions per week.");
		if (avgSleep < 7)
			recs.add("Aim for 7–8 hours of restful sleep. Maintain regular bedtime/waketime.");
		if (meals.size() < 2 && (input == null || input.getDailyCalories() < 1200))
			recs.add("Ensure balanced meals with plenty of green vegetables, fruits, and proper protein intake.");
		if (stresses.stream().anyMatch(s -> "High".equalsIgnoreCase(s.getLevel())) || (input != null && input.getStressLevel() > 5))
			recs.add("Practice deep pranayama, alternate nostril breathing, or guided meditation daily to lower stress.");

		// Questionnaire-based recommendations
		if (input != null) {
			if (input.getWaterIntake() < 2.0)
				recs.add("Your water intake is below optimal — aim for 2–3L daily to flush out toxins.");
			if ("Lonely".equalsIgnoreCase(input.getMood()))
				recs.add("Try joining group yoga sessions or spiritual chanting circles (Satsang) to rebuild social connections.");
			if ("Beginner".equalsIgnoreCase(input.getYogaExperience()))
				recs.add("Start with gentle beginner yoga postures (Sukshma Vyayama) and Pawanmuktasana series.");
			if (input.getSleepHours() < 6)
				recs.add("Practice Yoga Nidra for 15-20 minutes in the afternoon to compensate for short sleep.");
			if (input.getWorkSatisfaction() != null && input.getWorkSatisfaction() < 5)
				recs.add("Set clear work-life boundaries and incorporate 5-minute desk stretches every 2 hours.");
			if (input.getWithNature() != null && input.getWithNature() < 1)
				recs.add("Spend at least 15-30 minutes daily walking barefoot on green grass or sitting amidst nature.");
			if (Boolean.TRUE.equals(input.getHasDisease()))
				recs.add("Consult an AYUSH doctor for restorative yoga programs tailored to your medical history.");
		}

		WellnessReport report = new WellnessReport(workoutSummary, nutritionSummary, sleepSummary, stressSummary, recs);

		// Attach questionnaire data
		if (input != null) {
			report.setAge(input.getAge());
			report.setHeight(input.getHeight());
			report.setWeight(input.getWeight());
			report.setMood(input.getMood());
			report.setEnergyLevel(input.getEnergyLevel());
			report.setWaterIntake(input.getWaterIntake());
			report.setDigestiveIssues(input.getDigestiveIssues());
			report.setPainArea(input.getPainArea());
			report.setYogaExperience(input.getYogaExperience());
			report.setDaysPerWeek(input.getDaysPerWeek());
			report.setMinutesPerSession(input.getMinutesPerSession());
			report.setJournalEntry(input.getJournalEntry());
		}

		return report;
	}

}