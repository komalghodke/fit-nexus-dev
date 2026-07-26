package com.fitnexus.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitnexus.entity.Feedback;
import com.fitnexus.repository.FeedbackRepository;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

	@Autowired
	private FeedbackRepository feedbackRepo;

	@PostMapping
	public ResponseEntity<Map<String, Object>> submitFeedback(@RequestBody Feedback feedback) {
		Map<String, Object> response = new HashMap<>();

		// Server-side mandatory email validation
		if (feedback.getEmail() == null || !feedback.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
			response.put("success", false);
			response.put("message", "A valid email address is mandatory for feedback submission.");
			return ResponseEntity.badRequest().body(response);
		}

		if (feedback.getMessage() == null || feedback.getMessage().trim().isEmpty()) {
			response.put("success", false);
			response.put("message", "Feedback message cannot be empty.");
			return ResponseEntity.badRequest().body(response);
		}

		Feedback saved = feedbackRepo.save(feedback);
		response.put("success", true);
		response.put("message", "Thank you for your feedback! Your insights help us improve FitNexus.");
		response.put("data", saved);
		return ResponseEntity.ok(response);
	}

	@GetMapping
	public ResponseEntity<List<Feedback>> getAllFeedbacks() {
		List<Feedback> list = feedbackRepo.findAllByOrderByCreatedAtDesc();
		return ResponseEntity.ok(list);
	}
}
