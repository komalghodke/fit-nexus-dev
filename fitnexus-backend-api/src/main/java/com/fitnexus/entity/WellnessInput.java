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

	private int age;
	private int height;
	private int weight;
	private double waterIntake;
	private String digestiveIssues;
	private String painArea;

	private String mood;
	private int stressLevel;
	private double sleepHours;
	private String sleepQuality; // Changed to String to match request
	private String sleep;
	private String innerPeace;

	private String socialSupport;
	private Integer workSatisfaction;
	private Integer withNature;
	private Boolean hasDisease;

	// Workout details
	private String workoutType;
	private int workoutDuration;
	private int workoutFrequency;

	// Nutrition details
	private int dailyCalories;
	private int proteinIntake;
	private int fruitServings;
	private int vegetableServings;

	// Sleep details
	private String bedtime;
	private String wakeTime;

	// Stress details
	private String stressTriggers;
	private String relaxationPractice;

	// Lifestyle
	private String smoking;
	private String alcohol;
	private int screenTime;
	private int physicalActivity;

	// Mental / Spiritual
	private int meditationMinutes;
	private String energyLevel;

	// Medical
	private String chronicConditions;
	private String medications;
	private double bmi;
	private int restingHeartRate;

	// Yoga specific
	private String yogaExperience;
	private int daysPerWeek;
	private int minutesPerSession;

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

	public String getMood() {
		return mood;
	}

	public void setMood(String mood) {
		this.mood = mood;
	}

	public int getStressLevel() {
		return stressLevel;
	}

	public void setStressLevel(int stressLevel) {
		this.stressLevel = stressLevel;
	}

	public double getSleepHours() {
		return sleepHours;
	}

	public void setSleepHours(double sleepHours) {
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

	public int getWorkoutDuration() {
		return workoutDuration;
	}

	public void setWorkoutDuration(int workoutDuration) {
		this.workoutDuration = workoutDuration;
	}

	public int getWorkoutFrequency() {
		return workoutFrequency;
	}

	public void setWorkoutFrequency(int workoutFrequency) {
		this.workoutFrequency = workoutFrequency;
	}

	public int getDailyCalories() {
		return dailyCalories;
	}

	public void setDailyCalories(int dailyCalories) {
		this.dailyCalories = dailyCalories;
	}

	public int getProteinIntake() {
		return proteinIntake;
	}

	public void setProteinIntake(int proteinIntake) {
		this.proteinIntake = proteinIntake;
	}

	public int getFruitServings() {
		return fruitServings;
	}

	public void setFruitServings(int fruitServings) {
		this.fruitServings = fruitServings;
	}

	public int getVegetableServings() {
		return vegetableServings;
	}

	public void setVegetableServings(int vegetableServings) {
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

	public int getScreenTime() {
		return screenTime;
	}

	public void setScreenTime(int screenTime) {
		this.screenTime = screenTime;
	}

	public int getPhysicalActivity() {
		return physicalActivity;
	}

	public void setPhysicalActivity(int physicalActivity) {
		this.physicalActivity = physicalActivity;
	}

	public int getMeditationMinutes() {
		return meditationMinutes;
	}

	public void setMeditationMinutes(int meditationMinutes) {
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

	public double getBmi() {
		return bmi;
	}

	public void setBmi(double bmi) {
		this.bmi = bmi;
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

	public int getRestingHeartRate() {
		return restingHeartRate;
	}

	public void setRestingHeartRate(int restingHeartRate) {
		this.restingHeartRate = restingHeartRate;
	}
}
