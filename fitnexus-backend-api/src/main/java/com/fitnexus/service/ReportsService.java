package com.fitnexus.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fitnexus.dto.WellnessReport;
import com.fitnexus.entity.Nutrition;
import com.fitnexus.entity.Sleep;
import com.fitnexus.entity.Stress;
import com.fitnexus.entity.Workout;
import com.fitnexus.repository.NutritionRepository;
import com.fitnexus.repository.SleepRepository;
import com.fitnexus.repository.StressRepository;
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

	public WellnessReport generateReport(Long userId) {
		List<Workout> workouts = workoutRepo.findByUserId(userId);
		List<Nutrition> meals = nutritionRepo.findByUserId(userId);
		List<Sleep> sleeps = sleepRepo.findByUserId(userId);
		List<Stress> stresses = stressRepo.findByUserId(userId);

		String workoutSummary = "Total workouts: " + workouts.size();
		String nutritionSummary = "Meals logged: " + meals.size();
		String sleepSummary = "Average sleep: " + sleeps.stream().mapToInt(Sleep::getHours).average().orElse(0)
				+ " hrs";
		String stressSummary = "Stress entries: " + stresses.size();

		List<String> recs = new ArrayList<>();
		if (workouts.size() < 3)
			recs.add("Increase yoga/physical activity to at least 3 sessions per week.");
		if (sleeps.stream().mapToInt(Sleep::getHours).average().orElse(0) < 7)
			recs.add("Aim for 7–8 hours of restful sleep.");
		if (meals.size() < 2)
			recs.add("Ensure balanced meals with fruits and vegetables.");
		if (stresses.stream().anyMatch(s -> s.getLevel().equalsIgnoreCase("High")))
			recs.add("Practice pranayama or meditation daily.");

		return new WellnessReport(workoutSummary, nutritionSummary, sleepSummary, stressSummary, recs);
	}
}
