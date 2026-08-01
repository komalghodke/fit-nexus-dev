package com.fitnexus.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitnexus.entity.Stress;
import com.fitnexus.entity.User;
import com.fitnexus.repository.StressRepository;
import com.fitnexus.repository.UserRepository;

@RestController
@RequestMapping("/api/stress")
@CrossOrigin(origins = "http://localhost:3000")
public class StressController {

	@Autowired
	private StressRepository stressRepository;

	@Autowired
	private UserRepository userRepository;

	@GetMapping("/{userId}")
	public List<Stress> getStress(@PathVariable("userId") Long userId) {
		return stressRepository.findByUserId(userId);
	}

	@PostMapping("/{userId}")
	public Stress addStress(@PathVariable("userId") Long userId, @RequestBody Map<String, Object> payload) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
		
		Stress stress = new Stress();
		stress.setUser(user);
		
		// Validate and clamp stress level to range 1-10
		Object levelObj = payload.get("level");
		if (levelObj != null && !levelObj.toString().trim().isEmpty()) {
			try {
				int level = Integer.parseInt(levelObj.toString().trim());
				level = Math.max(1, Math.min(10, level));
				stress.setLevel(String.valueOf(level));
			} catch (NumberFormatException e) {
				stress.setLevel("5"); // Default
			}
		} else {
			stress.setLevel("5");
		}

		String notes = (String) payload.get("notes");
		stress.setNotes(notes != null && !notes.trim().isEmpty() ? notes.trim() : "No notes provided");
		stress.setCreatedAt(LocalDateTime.now());
		
		return stressRepository.save(stress);
	}
}
