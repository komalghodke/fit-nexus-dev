package com.fitnexus.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitnexus.dto.AuthRequest;
import com.fitnexus.entity.User;
import com.fitnexus.repository.UserRepository;
import com.fitnexus.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private AuthenticationManager authManager;
	@Autowired
	private JwtUtil jwtUtil;
	@Autowired
	private UserRepository userRepo;

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody AuthRequest req) {
		try {
			authManager.authenticate(
				    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
				);
			User user = userRepo.findByEmail(req.getEmail())
					.orElseThrow(() -> new RuntimeException("User not found with email: " + req.getEmail()));
			String token = jwtUtil.generateToken(req.getEmail()); // ✅ subject = email
			return ResponseEntity.ok(Map.of(
				"token", token,
				"email", req.getEmail(),
				"userId", user.getId().toString(),
				"role", user.getRole() != null ? user.getRole() : "USER"
			));
		} catch (AuthenticationException e) {
			return ResponseEntity.status(401).body("Invalid credentials");
		}
	}

	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody User user) {
		if (user.getRole() == null || user.getRole().trim().isEmpty()) {
			user.setRole("USER");
		}
	    userRepo.save(user); // ✅ must include email + password
	    return ResponseEntity.ok("User registered successfully");
	}

}
