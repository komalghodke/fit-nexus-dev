package com.fitnexus.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fitnexus.dto.WellnessReport;
import com.fitnexus.dto.WellnessRequest;

@Service
public class WellnessService {

	public WellnessReport processAssessment(Long userId, WellnessRequest req) {
		WellnessReport report = new WellnessReport();
		int score = 0;

		// Example rules
		if (req.getSleepHours() >= 7)
			score += 2;
		if (req.getStressLevel() <= 3)
			score += 2;
		if ("No".equalsIgnoreCase(req.getSmoking()))
			score += 1;
		if ("No".equalsIgnoreCase(req.getAlcohol()))
			score += 1;
		if (req.getPhysicalActivity() >= 30)
			score += 2;

		// Summaries
		report.setWorkoutSummary(
				"Workout: " + req.getWorkoutDuration() + " mins, " + req.getWorkoutFrequency() + " times/week.");
		report.setNutritionSummary("Calories: " + req.getDailyCalories() + ", Protein: " + req.getProteinIntake()
				+ "g, Water: " + req.getWaterIntake() + "L.");
		report.setSleepSummary("Sleep: " + req.getSleepHours() + " hrs, Quality: " + req.getSleepQuality());
		report.setStressSummary("Stress: " + req.getStressLevel() + " /10, Triggers: " + req.getStressTriggers());

		// Recommendations
		List<String> recs = new ArrayList<>();
		if (req.getSleepHours() < 7)
			recs.add("Try to sleep at least 7 hours.");
		if (req.getStressLevel() > 5)
			recs.add("Practice relaxation techniques daily.");
		if (req.getWaterIntake() < 2.0)
			recs.add("Increase water intake to 2L/day.");
		report.setRecommendations(recs);

		// Extra fields
		report.setAge(req.getAge());
		report.setHeight(req.getHeight());
		report.setWeight(req.getWeight());
		report.setMood(req.getMood());
		report.setEnergyLevel(req.getEnergyLevel());
		report.setWaterIntake(req.getWaterIntake());
		report.setDigestiveIssues(req.getDigestiveIssues());
		report.setPainArea(req.getPainArea());
		report.setYogaExperience(req.getYogaExperience());
		report.setDaysPerWeek(req.getDaysPerWeek());
		report.setMinutesPerSession(req.getMinutesPerSession());
		report.setJournalEntry(req.getJournalEntry());

		return report;
	}
}
