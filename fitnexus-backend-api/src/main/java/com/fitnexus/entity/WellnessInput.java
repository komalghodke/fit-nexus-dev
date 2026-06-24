package com.fitnexus.entity;

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
	private int age;
	private int height;
	private int weight;
	private double sleepHours;
	private int sleepQuality;
	private String mood;
	private String energyLevel;
	private double waterIntake;
	private String digestiveIssues;
	private String painArea;
	private String yogaExperience;
	private int daysPerWeek;
	private int minutesPerSession;
	private String journalEntry;

	public WellnessInput() {
		super();
	}

	public WellnessInput(Long id, Long userId, int age, int height, int weight, double sleepHours, int sleepQuality,
			String mood, String energyLevel, double waterIntake, String digestiveIssues, String painArea,
			String yogaExperience, int daysPerWeek, int minutesPerSession, String journalEntry) {
		super();
		this.id = id;
		this.userId = userId;
		this.age = age;
		this.height = height;
		this.weight = weight;
		this.sleepHours = sleepHours;
		this.sleepQuality = sleepQuality;
		this.mood = mood;
		this.energyLevel = energyLevel;
		this.waterIntake = waterIntake;
		this.digestiveIssues = digestiveIssues;
		this.painArea = painArea;
		this.yogaExperience = yogaExperience;
		this.daysPerWeek = daysPerWeek;
		this.minutesPerSession = minutesPerSession;
		this.journalEntry = journalEntry;
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

	public double getSleepHours() {
		return sleepHours;
	}

	public void setSleepHours(double sleepHours) {
		this.sleepHours = sleepHours;
	}

	public int getSleepQuality() {
		return sleepQuality;
	}

	public void setSleepQuality(int sleepQuality) {
		this.sleepQuality = sleepQuality;
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

	@Override
	public String toString() {
		return "WellnessInput [id=" + id + ", userId=" + userId + ", age=" + age + ", height=" + height + ", weight="
				+ weight + ", sleepHours=" + sleepHours + ", sleepQuality=" + sleepQuality + ", mood=" + mood
				+ ", energyLevel=" + energyLevel + ", waterIntake=" + waterIntake + ", digestiveIssues="
				+ digestiveIssues + ", painArea=" + painArea + ", yogaExperience=" + yogaExperience + ", daysPerWeek="
				+ daysPerWeek + ", minutesPerSession=" + minutesPerSession + ", journalEntry=" + journalEntry + "]";
	}
}
