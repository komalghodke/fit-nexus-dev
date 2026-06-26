package com.fitnexus.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitnexus.entity.WellnessInput;
import com.fitnexus.repository.WellnessInputRepository;

@RestController
@RequestMapping("/api/wellness-input")
public class WellnessInputController {

	@Autowired
	private WellnessInputRepository repo;

	@PostMapping
	public WellnessInput saveInput(@RequestBody WellnessInput input) {
		return repo.save(input);
	}

	@GetMapping("/{userId}")
	public WellnessInput getInput(@PathVariable("userId") Long userId) {
		return repo.findByUserId(userId).orElseThrow(() -> new RuntimeException("No input found for user " + userId));
	}
}
