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

import com.fitnexus.entity.Sleep;
import com.fitnexus.entity.User;
import com.fitnexus.repository.SleepRepository;
import com.fitnexus.repository.UserRepository;

@RestController
@RequestMapping("/api/sleep")
@CrossOrigin(origins = "http://localhost:3000")
public class SleepController {

	@Autowired
	private SleepRepository sleepRepository;

	@Autowired
	private UserRepository userRepository;

	@GetMapping("/{userId}")
	public List<Sleep> getSleeps(@PathVariable("userId") Long userId) {
		return sleepRepository.findByUserId(userId);
	}

	@PostMapping("/{userId}")
	public Sleep addSleep(@PathVariable("userId") Long userId, @RequestBody Map<String, Object> payload) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
		
		Sleep sleep = new Sleep();
		sleep.setUser(user);
		
		Object hoursObj = payload.get("hours");
		if (hoursObj != null && !hoursObj.toString().isEmpty()) {
			try {
				sleep.setHours(Integer.parseInt(hoursObj.toString()));
			} catch (NumberFormatException e) {
				sleep.setHours(7); // Default
			}
		} else {
			sleep.setHours(7);
		}
		
		sleep.setQuality((String) payload.get("quality"));
		sleep.setCreatedAt(LocalDateTime.now());
		
		return sleepRepository.save(sleep);
	}
}
