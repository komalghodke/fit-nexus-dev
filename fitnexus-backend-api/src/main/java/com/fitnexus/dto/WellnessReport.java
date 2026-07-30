package com.fitnexus.dto;

import java.util.List;

public class WellnessReport {
	// ─── Summaries ───────────────────────────────────────────────────────
	private String workoutSummary;
	private String nutritionSummary;
	private String sleepSummary;
	private String stressSummary;
	private List<String> recommendations;

	// ─── Personal Info ────────────────────────────────────────────────────
	private String fullName;
	private String email;
	private String mobileNumber;
	private String gender;
	private String city;

	// ─── Physical ─────────────────────────────────────────────────────────
	private int age;
	private int height;
	private int weight;
	private double bmi;
	private double waterIntake;
	private String digestiveIssues;
	private String painArea;
	private int restingHeartRate;
	private double sleepHours;
	private String sleepQuality;

	// ─── Emotional / Mind ─────────────────────────────────────────────────
	private String mood;
	private String energyLevel;
	private int stressLevel;
	private String stressTriggers;
	private String innerPeace;
	private String bedtime;
	private String wakeTime;

	// ─── Activity / Yoga ─────────────────────────────────────────────────
	private String yogaExperience;
	private String workoutType;
	private int workoutDuration;
	private int workoutFrequency;
	private int daysPerWeek;
	private int minutesPerSession;
	private int meditationMinutes;

	// ─── Social / Occupational / Environmental ────────────────────────────
	private String socialSupport;
	private Integer workSatisfaction;
	private Integer withNature;

	// ─── Medical ─────────────────────────────────────────────────────────
	private Boolean hasDisease;
	private String chronicConditions;
	private String medications;

	// ─── Journal ─────────────────────────────────────────────────────────
	private String journalEntry;

	// ─── YCB / AYUSH rule-engine outputs ─────────────────────────────────
	private int score;
	private String status;
	private String mantra;
	private String affirmation;
	private String yogaRecommendation;
	private String moodInsight;
	private String journalReflection;
	private String chakra;
	private String medicalAdvisory;
	private List<String> wellnessTips;
	private List<String> sleepTips;
	private List<String> hydrationTips;
	private String staffNotes;

	public WellnessReport() {}

	public WellnessReport(String workoutSummary, String nutritionSummary, String sleepSummary, String stressSummary,
			List<String> recommendations) {
		this.workoutSummary = workoutSummary;
		this.nutritionSummary = nutritionSummary;
		this.sleepSummary = sleepSummary;
		this.stressSummary = stressSummary;
		this.recommendations = recommendations;
	}

	// ─── Getters & Setters ────────────────────────────────────────────────
	public String getWorkoutSummary() { return workoutSummary; }
	public void setWorkoutSummary(String v) { this.workoutSummary = v; }

	public String getNutritionSummary() { return nutritionSummary; }
	public void setNutritionSummary(String v) { this.nutritionSummary = v; }

	public String getSleepSummary() { return sleepSummary; }
	public void setSleepSummary(String v) { this.sleepSummary = v; }

	public String getStressSummary() { return stressSummary; }
	public void setStressSummary(String v) { this.stressSummary = v; }

	public List<String> getRecommendations() { return recommendations; }
	public void setRecommendations(List<String> v) { this.recommendations = v; }

	public String getFullName() { return fullName; }
	public void setFullName(String v) { this.fullName = v; }

	public String getEmail() { return email; }
	public void setEmail(String v) { this.email = v; }

	public String getMobileNumber() { return mobileNumber; }
	public void setMobileNumber(String v) { this.mobileNumber = v; }

	public String getGender() { return gender; }
	public void setGender(String v) { this.gender = v; }

	public String getCity() { return city; }
	public void setCity(String v) { this.city = v; }

	public int getAge() { return age; }
	public void setAge(int v) { this.age = v; }

	public int getHeight() { return height; }
	public void setHeight(int v) { this.height = v; }

	public int getWeight() { return weight; }
	public void setWeight(int v) { this.weight = v; }

	public double getWaterIntake() { return waterIntake; }
	public void setWaterIntake(double v) { this.waterIntake = v; }

	public String getDigestiveIssues() { return digestiveIssues; }
	public void setDigestiveIssues(String v) { this.digestiveIssues = v; }

	public String getPainArea() { return painArea; }
	public void setPainArea(String v) { this.painArea = v; }

	public int getRestingHeartRate() { return restingHeartRate; }
	public void setRestingHeartRate(int v) { this.restingHeartRate = v; }

	public double getSleepHours() { return sleepHours; }
	public void setSleepHours(double v) { this.sleepHours = v; }

	public String getSleepQuality() { return sleepQuality; }
	public void setSleepQuality(String v) { this.sleepQuality = v; }

	public String getMood() { return mood; }
	public void setMood(String v) { this.mood = v; }

	public String getEnergyLevel() { return energyLevel; }
	public void setEnergyLevel(String v) { this.energyLevel = v; }

	public int getStressLevel() { return stressLevel; }
	public void setStressLevel(int v) { this.stressLevel = v; }

	public String getStressTriggers() { return stressTriggers; }
	public void setStressTriggers(String v) { this.stressTriggers = v; }

	public String getInnerPeace() { return innerPeace; }
	public void setInnerPeace(String v) { this.innerPeace = v; }

	public String getBedtime() { return bedtime; }
	public void setBedtime(String v) { this.bedtime = v; }

	public String getWakeTime() { return wakeTime; }
	public void setWakeTime(String v) { this.wakeTime = v; }

	public String getYogaExperience() { return yogaExperience; }
	public void setYogaExperience(String v) { this.yogaExperience = v; }

	public String getWorkoutType() { return workoutType; }
	public void setWorkoutType(String v) { this.workoutType = v; }

	public int getWorkoutDuration() { return workoutDuration; }
	public void setWorkoutDuration(int v) { this.workoutDuration = v; }

	public int getWorkoutFrequency() { return workoutFrequency; }
	public void setWorkoutFrequency(int v) { this.workoutFrequency = v; }

	public int getDaysPerWeek() { return daysPerWeek; }
	public void setDaysPerWeek(int v) { this.daysPerWeek = v; }

	public int getMinutesPerSession() { return minutesPerSession; }
	public void setMinutesPerSession(int v) { this.minutesPerSession = v; }

	public int getMeditationMinutes() { return meditationMinutes; }
	public void setMeditationMinutes(int v) { this.meditationMinutes = v; }

	public String getSocialSupport() { return socialSupport; }
	public void setSocialSupport(String v) { this.socialSupport = v; }

	public Integer getWorkSatisfaction() { return workSatisfaction; }
	public void setWorkSatisfaction(Integer v) { this.workSatisfaction = v; }

	public Integer getWithNature() { return withNature; }
	public void setWithNature(Integer v) { this.withNature = v; }

	public Boolean getHasDisease() { return hasDisease; }
	public void setHasDisease(Boolean v) { this.hasDisease = v; }

	public String getChronicConditions() { return chronicConditions; }
	public void setChronicConditions(String v) { this.chronicConditions = v; }

	public String getMedications() { return medications; }
	public void setMedications(String v) { this.medications = v; }

	public String getJournalEntry() { return journalEntry; }
	public void setJournalEntry(String v) { this.journalEntry = v; }

	public int getScore() { return score; }
	public void setScore(int v) { this.score = v; }

	public String getStatus() { return status; }
	public void setStatus(String v) { this.status = v; }

	public String getMantra() { return mantra; }
	public void setMantra(String v) { this.mantra = v; }

	public String getAffirmation() { return affirmation; }
	public void setAffirmation(String v) { this.affirmation = v; }

	public String getYogaRecommendation() { return yogaRecommendation; }
	public void setYogaRecommendation(String v) { this.yogaRecommendation = v; }

	public String getMoodInsight() { return moodInsight; }
	public void setMoodInsight(String v) { this.moodInsight = v; }

	public String getJournalReflection() { return journalReflection; }
	public void setJournalReflection(String v) { this.journalReflection = v; }

	public String getChakra() { return chakra; }
	public void setChakra(String v) { this.chakra = v; }

	public String getMedicalAdvisory() { return medicalAdvisory; }
	public void setMedicalAdvisory(String v) { this.medicalAdvisory = v; }

	public List<String> getWellnessTips() { return wellnessTips; }
	public void setWellnessTips(List<String> v) { this.wellnessTips = v; }

	public List<String> getSleepTips() { return sleepTips; }
	public void setSleepTips(List<String> v) { this.sleepTips = v; }

	public List<String> getHydrationTips() { return hydrationTips; }
	public void setHydrationTips(List<String> v) { this.hydrationTips = v; }

	public double getBmi() { return bmi; }
	public void setBmi(double v) { this.bmi = v; }

	public String getStaffNotes() { return staffNotes; }
	public void setStaffNotes(String v) { this.staffNotes = v; }

	// ─── Predictive AI Scores ────────────────────────────────────────────
	private int predictedCalorieBurn;
	private int predictedStressTrend;
	private int predictedSleepQuality;

	public int getPredictedCalorieBurn() { return predictedCalorieBurn; }
	public void setPredictedCalorieBurn(int v) { this.predictedCalorieBurn = v; }

	public int getPredictedStressTrend() { return predictedStressTrend; }
	public void setPredictedStressTrend(int v) { this.predictedStressTrend = v; }

	public int getPredictedSleepQuality() { return predictedSleepQuality; }
	public void setPredictedSleepQuality(int v) { this.predictedSleepQuality = v; }
}
