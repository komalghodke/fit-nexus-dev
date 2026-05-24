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

import com.fitnexus.dto.ProfileDto;
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
	public ResponseEntity<ProfileDto> getProfile(Authentication authentication) {
		String email = authentication.getName();
		User user = userRepository.findByEmail(email).orElseThrow();

		ProfileDto dto = new ProfileDto();
		dto.setEmail(user.getEmail());
		dto.setName(user.getName());
		return ResponseEntity.ok(dto);
	}

	@PutMapping("/profile")
	public ResponseEntity<ProfileDto> updateProfile(Authentication authentication, @RequestBody ProfileDto dto) {
		String email = authentication.getName();
		User user = userRepository.findByEmail(email).orElseThrow();

		user.setName(dto.getName());
		userRepository.save(user);

		ProfileDto updated = new ProfileDto();
		updated.setEmail(user.getEmail());
		updated.setName(user.getName());
		return ResponseEntity.ok(updated);
	}
}
