package com.fitnexus.dto;

import java.util.List;

public class WellnessReport {
	private String workoutSummary;
	private String nutritionSummary;
	private String sleepSummary;
	private String stressSummary;
	private List<String> recommendations;

	public WellnessReport(String workoutSummary, String nutritionSummary, String sleepSummary, String stressSummary,
			List<String> recommendations) {
		this.workoutSummary = workoutSummary;
		this.nutritionSummary = nutritionSummary;
		this.sleepSummary = sleepSummary;
		this.stressSummary = stressSummary;
		this.recommendations = recommendations;
	}

	public String getWorkoutSummary() {
		return workoutSummary;
	}

	public void setWorkoutSummary(String workoutSummary) {
		this.workoutSummary = workoutSummary;
	}

	public String getNutritionSummary() {
		return nutritionSummary;
	}

	public void setNutritionSummary(String nutritionSummary) {
		this.nutritionSummary = nutritionSummary;
	}

	public String getSleepSummary() {
		return sleepSummary;
	}

	public void setSleepSummary(String sleepSummary) {
		this.sleepSummary = sleepSummary;
	}

	public String getStressSummary() {
		return stressSummary;
	}

	public void setStressSummary(String stressSummary) {
		this.stressSummary = stressSummary;
	}

	public List<String> getRecommendations() {
		return recommendations;
	}

	public void setRecommendations(List<String> recommendations) {
		this.recommendations = recommendations;
	}
}
