package com.fitnexus.dto;

import java.util.List;

public class WellnessReport {
	private String workoutSummary;
	private String nutritionSummary;
	private String sleepSummary;
	private String stressSummary;
	private List<String> recommendations;

	private int age;
	private int height;
	private int weight;
	private String mood;
	private String energyLevel;
	private double waterIntake;
	private String digestiveIssues;
	private String painArea;
	private String yogaExperience;
	private int daysPerWeek;
	private int minutesPerSession;
	private String journalEntry;

	public WellnessReport() {
	}

	public WellnessReport(String workoutSummary, String nutritionSummary, String sleepSummary, String stressSummary,
			List<String> recommendations) {
		this.workoutSummary = workoutSummary;
		this.nutritionSummary = nutritionSummary;
		this.sleepSummary = sleepSummary;
		this.stressSummary = stressSummary;
		this.recommendations = recommendations;
	}

	// Getters & Setters
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

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	public int getHeight() {
		return height;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	public int getWeight() {
		return weight;
	}

	public void setWeight(int weight) {
		this.weight = weight;
	}

	public String getMood() {
		return mood;
	}

	public void setMood(String mood) {
		this.mood = mood;
	}

	public String getEnergyLevel() {
		return energyLevel;
	}

	public void setEnergyLevel(String energyLevel) {
		this.energyLevel = energyLevel;
	}

	public double getWaterIntake() {
		return waterIntake;
	}

	public void setWaterIntake(double waterIntake) {
		this.waterIntake = waterIntake;
	}

	public String getDigestiveIssues() {
		return digestiveIssues;
	}

	public void setDigestiveIssues(String digestiveIssues) {
		this.digestiveIssues = digestiveIssues;
	}

	public String getPainArea() {
		return painArea;
	}

	public void setPainArea(String painArea) {
		this.painArea = painArea;
	}

	public String getYogaExperience() {
		return yogaExperience;
	}

	public void setYogaExperience(String yogaExperience) {
		this.yogaExperience = yogaExperience;
	}

	public int getDaysPerWeek() {
		return daysPerWeek;
	}

	public void setDaysPerWeek(int daysPerWeek) {
		this.daysPerWeek = daysPerWeek;
	}

	public int getMinutesPerSession() {
		return minutesPerSession;
	}

	public void setMinutesPerSession(int minutesPerSession) {
		this.minutesPerSession = minutesPerSession;
	}

	public String getJournalEntry() {
		return journalEntry;
	}

	public void setJournalEntry(String journalEntry) {
		this.journalEntry = journalEntry;
	}
}
