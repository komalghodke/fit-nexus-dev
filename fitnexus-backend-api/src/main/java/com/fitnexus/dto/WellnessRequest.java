package com.fitnexus.dto;

public class WellnessRequest {

	private String fullName;
	private String email;
	private String mobileNumber;
	private String gender;
	private String city;
	private String sleep;
	private String innerPeace;

	private Integer workSatisfaction;
	private Integer withNature;
	private Boolean hasDisease;
	// Workout
	private String workoutType;
	private Integer workoutDuration;
	private Integer workoutFrequency;

	// Nutrition
	private Integer dailyCalories;
	private Integer proteinIntake;
	private Double waterIntake;
	private Integer fruitServings;
	private Integer vegetableServings;

	// Sleep
	private Integer sleepHours;
	private String sleepQuality;
	private String bedtime;
	private String wakeTime;

	// Stress
	private Integer stressLevel;
	private String stressTriggers;
	private String relaxationPractice;

	// Lifestyle
	private String smoking;
	private String alcohol;
	private Integer screenTime;
	private Integer physicalActivity;

	// Mental Wellness
	private String mood;
	private Integer meditationMinutes;
	private String socialSupport;

	// Medical
	private Integer age;
	private Integer height;
	private Integer weight;
	private String chronicConditions;
	private String medications;
	private Double bmi;
	private Integer restingHeartRate;

	// Other
	private String energyLevel;
	private String digestiveIssues;
	private String painArea;
	private String yogaExperience;
	private Integer daysPerWeek;
	private Integer minutesPerSession;
	private String journalEntry;

	public WellnessRequest() {
		super();
	}

	public WellnessRequest(String fullName, String email, String mobileNumber, String gender, String city, String sleep,
			String innerPeace, Integer workSatisfaction, Integer withNature, Boolean hasDisease, String workoutType,
			Integer workoutDuration, Integer workoutFrequency, Integer dailyCalories, Integer proteinIntake, Double waterIntake,
			Integer fruitServings, Integer vegetableServings, Integer sleepHours, String sleepQuality, String bedtime,
			String wakeTime, Integer stressLevel, String stressTriggers, String relaxationPractice, String smoking,
			String alcohol, Integer screenTime, Integer physicalActivity, String mood, Integer meditationMinutes,
			String socialSupport, Integer age, Integer height, Integer weight, String chronicConditions, String medications,
			Double bmi, String energyLevel, String digestiveIssues, String painArea, String yogaExperience,
			Integer daysPerWeek, Integer minutesPerSession, String journalEntry) {
		super();
		this.fullName = fullName;
		this.email = email;
		this.mobileNumber = mobileNumber;
		this.gender = gender;
		this.city = city;
		this.sleep = sleep;
		this.innerPeace = innerPeace;
		this.workSatisfaction = workSatisfaction;
		this.withNature = withNature;
		this.hasDisease = hasDisease;
		this.workoutType = workoutType;
		this.workoutDuration = workoutDuration;
		this.workoutFrequency = workoutFrequency;
		this.dailyCalories = dailyCalories;
		this.proteinIntake = proteinIntake;
		this.waterIntake = waterIntake;
		this.fruitServings = fruitServings;
		this.vegetableServings = vegetableServings;
		this.sleepHours = sleepHours;
		this.sleepQuality = sleepQuality;
		this.bedtime = bedtime;
		this.wakeTime = wakeTime;
		this.stressLevel = stressLevel;
		this.stressTriggers = stressTriggers;
		this.relaxationPractice = relaxationPractice;
		this.smoking = smoking;
		this.alcohol = alcohol;
		this.screenTime = screenTime;
		this.physicalActivity = physicalActivity;
		this.mood = mood;
		this.meditationMinutes = meditationMinutes;
		this.socialSupport = socialSupport;
		this.age = age;
		this.height = height;
		this.weight = weight;
		this.chronicConditions = chronicConditions;
		this.medications = medications;
		this.bmi = bmi;
		this.energyLevel = energyLevel;
		this.digestiveIssues = digestiveIssues;
		this.painArea = painArea;
		this.yogaExperience = yogaExperience;
		this.daysPerWeek = daysPerWeek;
		this.minutesPerSession = minutesPerSession;
		this.journalEntry = journalEntry;
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

	// ✅ Getters & Setters for all fields
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

	public Double getWaterIntake() {
		return waterIntake;
	}

	public void setWaterIntake(Double waterIntake) {
		this.waterIntake = waterIntake;
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

	public Integer getSleepHours() {
		return sleepHours;
	}

	public void setSleepHours(Integer sleepHours) {
		this.sleepHours = sleepHours;
	}

	public String getSleepQuality() {
		return sleepQuality;
	}

	public void setSleepQuality(String sleepQuality) {
		this.sleepQuality = sleepQuality;
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

	public Integer getStressLevel() {
		return stressLevel;
	}

	public void setStressLevel(Integer stressLevel) {
		this.stressLevel = stressLevel;
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

	public String getMood() {
		return mood;
	}

	public void setMood(String mood) {
		this.mood = mood;
	}

	public Integer getMeditationMinutes() {
		return meditationMinutes;
	}

	public void setMeditationMinutes(Integer meditationMinutes) {
		this.meditationMinutes = meditationMinutes;
	}

	public String getSocialSupport() {
		return socialSupport;
	}

	public void setSocialSupport(String socialSupport) {
		this.socialSupport = socialSupport;
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

	public String getEnergyLevel() {
		return energyLevel;
	}

	public void setEnergyLevel(String energyLevel) {
		this.energyLevel = energyLevel;
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

	@Override
	public String toString() {
		return "WellnessRequest [fullName=" + fullName + ", email=" + email + ", mobileNumber=" + mobileNumber
				+ ", gender=" + gender + ", city=" + city + ", sleep=" + sleep + ", innerPeace=" + innerPeace
				+ ", workSatisfaction=" + workSatisfaction + ", withNature=" + withNature + ", hasDisease=" + hasDisease
				+ ", workoutType=" + workoutType + ", workoutDuration=" + workoutDuration + ", workoutFrequency="
				+ workoutFrequency + ", dailyCalories=" + dailyCalories + ", proteinIntake=" + proteinIntake
				+ ", waterIntake=" + waterIntake + ", fruitServings=" + fruitServings + ", vegetableServings="
				+ vegetableServings + ", sleepHours=" + sleepHours + ", sleepQuality=" + sleepQuality + ", bedtime="
				+ bedtime + ", wakeTime=" + wakeTime + ", stressLevel=" + stressLevel + ", stressTriggers="
				+ stressTriggers + ", relaxationPractice=" + relaxationPractice + ", smoking=" + smoking + ", alcohol="
				+ alcohol + ", screenTime=" + screenTime + ", physicalActivity=" + physicalActivity + ", mood=" + mood
				+ ", meditationMinutes=" + meditationMinutes + ", socialSupport=" + socialSupport + ", age=" + age
				+ ", height=" + height + ", weight=" + weight + ", chronicConditions=" + chronicConditions
				+ ", medications=" + medications + ", bmi=" + bmi + ", energyLevel=" + energyLevel
				+ ", digestiveIssues=" + digestiveIssues + ", painArea=" + painArea + ", yogaExperience="
				+ yogaExperience + ", daysPerWeek=" + daysPerWeek + ", minutesPerSession=" + minutesPerSession
				+ ", journalEntry=" + journalEntry + "]";
	}
}
