package com.fitnexus.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitnexus.entity.User;
import com.fitnexus.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserRepository userRepository;

	@GetMapping
	public List<User> getAllUsers() {
		return userRepository.findAll();
	}

	@PostMapping
	public User createUser(@RequestBody User user) {
		return userRepository.save(user);
	}

	@GetMapping("/profile")
	public ResponseEntity<?> getProfile(Authentication authentication) {
		String email = authentication.getName();
		User user = userRepository.findByEmail(email).orElseThrow();
		return ResponseEntity.ok(user);
	}

	@PutMapping("/profile")
	public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody User updated) {
		String email = authentication.getName();
		User user = userRepository.findByEmail(email).orElseThrow();
		user.setName(updated.getName());
		userRepository.save(user);
		return ResponseEntity.ok(user);
	}
}
