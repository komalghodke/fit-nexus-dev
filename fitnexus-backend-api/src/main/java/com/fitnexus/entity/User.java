package com.fitnexus.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String username;
	private String email;
	private String password;
	private String role = "USER";
	@jakarta.persistence.Column(columnDefinition = "TEXT")
	private String staffNotes;

	@JsonIgnore
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Workout> workouts;

	@JsonIgnore
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Nutrition> nutritionLogs;

	@JsonIgnore
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Sleep> sleepLogs;

	@JsonIgnore
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Stress> stressLogs;

	public User() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public List<Workout> getWorkouts() {
		return workouts;
	}

	public void setWorkouts(List<Workout> workouts) {
		this.workouts = workouts;
	}

	public List<Nutrition> getNutritionLogs() {
		return nutritionLogs;
	}

	public void setNutritionLogs(List<Nutrition> nutritionLogs) {
		this.nutritionLogs = nutritionLogs;
	}

	public List<Sleep> getSleepLogs() {
		return sleepLogs;
	}

	public void setSleepLogs(List<Sleep> sleepLogs) {
		this.sleepLogs = sleepLogs;
	}

	public List<Stress> getStressLogs() {
		return stressLogs;
	}

	public void setStressLogs(List<Stress> stressLogs) {
		this.stressLogs = stressLogs;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getStaffNotes() {
		return staffNotes;
	}

	public void setStaffNotes(String staffNotes) {
		this.staffNotes = staffNotes;
	}
}