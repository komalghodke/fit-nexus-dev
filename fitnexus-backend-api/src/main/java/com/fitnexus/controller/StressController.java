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
		
		Object levelObj = payload.get("level");
		stress.setLevel(levelObj != null ? levelObj.toString() : "5");
		stress.setNotes((String) payload.get("notes"));
		stress.setCreatedAt(LocalDateTime.now());
		
		return stressRepository.save(stress);
	}
}
