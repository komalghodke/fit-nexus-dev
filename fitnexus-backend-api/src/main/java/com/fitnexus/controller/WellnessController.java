package com.fitnexus.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitnexus.dto.WellnessReport;
import com.fitnexus.dto.WellnessRequest;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class WellnessController {

	@PostMapping("/wellness/{userId}")
	public ResponseEntity<String> saveWellness(@PathVariable Long userId, @RequestBody WellnessRequest request) {
		// TODO: save to DB
		System.out.println("Saving wellness for user " + userId + ": " + request);
		return ResponseEntity.ok("Wellness data saved");
	}

	@GetMapping("/reports/{userId}")
	public ResponseEntity<WellnessReport> getReport(@PathVariable Long userId) {
		WellnessReport report = new WellnessReport();
		report.setWorkoutSummary("30 mins walking daily");
		report.setNutritionSummary("Balanced diet, more fruits");
		report.setSleepSummary("Average 7 hours sleep");
		report.setStressSummary("Moderate stress, needs relaxation");
		report.setRecommendations(
				List.of("Add yoga 3 times a week", "Drink 2L water daily", "Practice meditation 10 mins"));
		return ResponseEntity.ok(report);
	}
}