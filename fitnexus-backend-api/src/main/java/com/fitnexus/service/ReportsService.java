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

		// Summaries
		String workoutSummary = "Total workouts: " + workouts.size();
		String nutritionSummary = "Meals logged: " + meals.size();
		double avgSleep = sleeps.stream().mapToInt(Sleep::getHours).average().orElse(0);
		String sleepSummary = "Average sleep: " + avgSleep + " hrs";
		String stressSummary = "Stress entries: " + stresses.size();

		List<String> recs = new ArrayList<>();
		if (workouts.size() < 3)
			recs.add("Increase yoga/physical activity to at least 3 sessions per week.");
		if (avgSleep < 7)
			recs.add("Aim for 7–8 hours of restful sleep.");
		if (meals.size() < 2)
			recs.add("Ensure balanced meals with fruits and vegetables.");
		if (stresses.stream().anyMatch(s -> s.getLevel().equalsIgnoreCase("High")))
			recs.add("Practice pranayama or meditation daily.");

		// Questionnaire-based recommendations
		if (input != null) {
			if (input.getWaterIntake() < 2.0)
				recs.add("Your water intake is below optimal — aim for 2–3L daily.");
			if ("Lonely".equalsIgnoreCase(input.getMood()))
				recs.add("Try group yoga or mantra chanting to reconnect.");
			if ("Beginner".equalsIgnoreCase(input.getYogaExperience()))
				recs.add("Start with gentle beginner yoga flows.");
			if (input.getSleepHours() < 6)
				recs.add("Practice Yoga Nidra for better sleep.");
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