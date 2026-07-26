package com.fitnexus.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@CrossOrigin(origins = "*")
public class WellnessInputController {

	@Autowired
	private WellnessInputRepository repo;

	@PostMapping
	public ResponseEntity<WellnessInput> saveInput(@RequestBody WellnessInput input) {
		WellnessInput saved = repo.save(input);
		return ResponseEntity.ok(saved);
	}

	@GetMapping("/{userId}")
	public ResponseEntity<WellnessInput> getInput(@PathVariable("userId") Long userId) {
		return repo.findByUserId(userId)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.ok(null));
	}
}
