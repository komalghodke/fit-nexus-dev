package com.fitnexus.entity;

import java.time.LocalDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "feedbacks")
public class Feedback {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String fullName;
	private String email;
	private Integer rating;
	private String category;
	private String message;
	private LocalDateTime createdAt;

	@PrePersist
	protected void onCreate() {
		this.createdAt = LocalDateTime.now();
	}

	public Feedback() {}

	public Feedback(String fullName, String email, Integer rating, String category, String message) {
		this.fullName = fullName;
		this.email = email;
		this.rating = rating;
		this.category = category;
		this.message = message;
	}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }

	public String getFullName() { return fullName; }
	public void setFullName(String fullName) { this.fullName = fullName; }

	public String getEmail() { return email; }
	public void setEmail(String email) { this.email = email; }

	public Integer getRating() { return rating; }
	public void setRating(Integer rating) { this.rating = rating; }

	public String getCategory() { return category; }
	public void setCategory(String category) { this.category = category; }

	public String getMessage() { return message; }
	public void setMessage(String message) { this.message = message; }

	public LocalDateTime getCreatedAt() { return createdAt; }
	public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
