package com.fitnexus.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "wellness_inputs")
public class WellnessInput {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Long userId;

	private String fullName;
	private String email;
	private String mobileNumber;
	private String gender;
	private String city;

	private Integer age;
	private Integer height;
	private Integer weight;
	private Double waterIntake;
	private String digestiveIssues;
	private String painArea;

	private String mood;
	private Integer stressLevel;
	private Double sleepHours;
	private String sleepQuality; // Changed to String to match request
	private String sleep;
	private String innerPeace;

	private String socialSupport;
	private Integer workSatisfaction;
	private Integer withNature;
	private Boolean hasDisease;

	// Workout details
	private String workoutType;
	private Integer workoutDuration;
	private Integer workoutFrequency;

	// Nutrition details
	private Integer dailyCalories;
	private Integer proteinIntake;
	private Integer fruitServings;
	private Integer vegetableServings;

	// Sleep details
	private String bedtime;
	private String wakeTime;

	// Stress details
	private String stressTriggers;
	private String relaxationPractice;

	// Lifestyle
	private String smoking;
	private String alcohol;
	private Integer screenTime;
	private Integer physicalActivity;

	// Mental / Spiritual
	private Integer meditationMinutes;
	private String energyLevel;

	// Medical
	private String chronicConditions;
	private String medications;
	private Double bmi;
	private Integer restingHeartRate;

	// Yoga specific
	private String yogaExperience;
	private Integer daysPerWeek;
	private Integer minutesPerSession;

	@Column(length = 1000)
	private String journalEntry;

	public WellnessInput() {
		super();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public Integer getAge() {
		return age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}

	public Integer getHeight() {
		return height;
	}

	public void setHeight(Integer height) {
		this.height = height;
	}

	public Integer getWeight() {
		return weight;
	}

	public void setWeight(Integer weight) {
		this.weight = weight;
	}

	public Double getWaterIntake() {
		return waterIntake;
	}

	public void setWaterIntake(Double waterIntake) {
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

	public String getMood() {
		return mood;
	}

	public void setMood(String mood) {
		this.mood = mood;
	}

	public Integer getStressLevel() {
		return stressLevel;
	}

	public void setStressLevel(Integer stressLevel) {
		this.stressLevel = stressLevel;
	}

	public Double getSleepHours() {
		return sleepHours;
	}

	public void setSleepHours(Double sleepHours) {
		this.sleepHours = sleepHours;
	}

	public String getSleepQuality() {
		return sleepQuality;
	}

	public void setSleepQuality(String sleepQuality) {
		this.sleepQuality = sleepQuality;
	}

	public String getSleep() {
		return sleep;
	}

	public void setSleep(String sleep) {
		this.sleep = sleep;
	}

	public String getInnerPeace() {
		return innerPeace;
	}

	public void setInnerPeace(String innerPeace) {
		this.innerPeace = innerPeace;
	}

	public String getSocialSupport() {
		return socialSupport;
	}

	public void setSocialSupport(String socialSupport) {
		this.socialSupport = socialSupport;
	}

	public Integer getWorkSatisfaction() {
		return workSatisfaction;
	}

	public void setWorkSatisfaction(Integer workSatisfaction) {
		this.workSatisfaction = workSatisfaction;
	}

	public Integer getWithNature() {
		return withNature;
	}

	public void setWithNature(Integer withNature) {
		this.withNature = withNature;
	}

	public Boolean getHasDisease() {
		return hasDisease;
	}

	public void setHasDisease(Boolean hasDisease) {
		this.hasDisease = hasDisease;
	}

	public String getWorkoutType() {
		return workoutType;
	}

	public void setWorkoutType(String workoutType) {
		this.workoutType = workoutType;
	}

	public Integer getWorkoutDuration() {
		return workoutDuration;
	}

	public void setWorkoutDuration(Integer workoutDuration) {
		this.workoutDuration = workoutDuration;
	}

	public Integer getWorkoutFrequency() {
		return workoutFrequency;
	}

	public void setWorkoutFrequency(Integer workoutFrequency) {
		this.workoutFrequency = workoutFrequency;
	}

	public Integer getDailyCalories() {
		return dailyCalories;
	}

	public void setDailyCalories(Integer dailyCalories) {
		this.dailyCalories = dailyCalories;
	}

	public Integer getProteinIntake() {
		return proteinIntake;
	}

	public void setProteinIntake(Integer proteinIntake) {
		this.proteinIntake = proteinIntake;
	}

	public Integer getFruitServings() {
		return fruitServings;
	}

	public void setFruitServings(Integer fruitServings) {
		this.fruitServings = fruitServings;
	}

	public Integer getVegetableServings() {
		return vegetableServings;
	}

	public void setVegetableServings(Integer vegetableServings) {
		this.vegetableServings = vegetableServings;
	}

	public String getBedtime() {
		return bedtime;
	}

	public void setBedtime(String bedtime) {
		this.bedtime = bedtime;
	}

	public String getWakeTime() {
		return wakeTime;
	}

	public void setWakeTime(String wakeTime) {
		this.wakeTime = wakeTime;
	}

	public String getStressTriggers() {
		return stressTriggers;
	}

	public void setStressTriggers(String stressTriggers) {
		this.stressTriggers = stressTriggers;
	}

	public String getRelaxationPractice() {
		return relaxationPractice;
	}

	public void setRelaxationPractice(String relaxationPractice) {
		this.relaxationPractice = relaxationPractice;
	}

	public String getSmoking() {
		return smoking;
	}

	public void setSmoking(String smoking) {
		this.smoking = smoking;
	}

	public String getAlcohol() {
		return alcohol;
	}

	public void setAlcohol(String alcohol) {
		this.alcohol = alcohol;
	}

	public Integer getScreenTime() {
		return screenTime;
	}

	public void setScreenTime(Integer screenTime) {
		this.screenTime = screenTime;
	}

	public Integer getPhysicalActivity() {
		return physicalActivity;
	}

	public void setPhysicalActivity(Integer physicalActivity) {
		this.physicalActivity = physicalActivity;
	}

	public Integer getMeditationMinutes() {
		return meditationMinutes;
	}

	public void setMeditationMinutes(Integer meditationMinutes) {
		this.meditationMinutes = meditationMinutes;
	}

	public String getEnergyLevel() {
		return energyLevel;
	}

	public void setEnergyLevel(String energyLevel) {
		this.energyLevel = energyLevel;
	}

	public String getChronicConditions() {
		return chronicConditions;
	}

	public void setChronicConditions(String chronicConditions) {
		this.chronicConditions = chronicConditions;
	}

	public String getMedications() {
		return medications;
	}

	public void setMedications(String medications) {
		this.medications = medications;
	}

	public Double getBmi() {
		return bmi;
	}

	public void setBmi(Double bmi) {
		this.bmi = bmi;
	}

	public String getYogaExperience() {
		return yogaExperience;
	}

	public void setYogaExperience(String yogaExperience) {
		this.yogaExperience = yogaExperience;
	}

	public Integer getDaysPerWeek() {
		return daysPerWeek;
	}

	public void setDaysPerWeek(Integer daysPerWeek) {
		this.daysPerWeek = daysPerWeek;
	}

	public Integer getMinutesPerSession() {
		return minutesPerSession;
	}

	public void setMinutesPerSession(Integer minutesPerSession) {
		this.minutesPerSession = minutesPerSession;
	}

	public String getJournalEntry() {
		return journalEntry;
	}

	public void setJournalEntry(String journalEntry) {
		this.journalEntry = journalEntry;
	}

	public Integer getRestingHeartRate() {
		return restingHeartRate;
	}

	public void setRestingHeartRate(Integer restingHeartRate) {
		this.restingHeartRate = restingHeartRate;
	}
}
