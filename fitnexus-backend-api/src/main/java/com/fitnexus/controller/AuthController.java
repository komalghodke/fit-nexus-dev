package com.fitnexus.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@CrossOrigin(origins = "*")
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
			String normalizedEmail = req.getEmail().trim().toLowerCase();
			authManager.authenticate(
				    new UsernamePasswordAuthenticationToken(normalizedEmail, req.getPassword())
				);
			User user = userRepo.findByEmail(req.getEmail().trim())
					.orElseGet(() -> userRepo.findByEmail(normalizedEmail)
					.orElseThrow(() -> new RuntimeException("User not found with email: " + req.getEmail())));
			String token = jwtUtil.generateToken(user.getEmail().trim().toLowerCase());
			return ResponseEntity.ok(Map.of(
				"token", token,
				"email", user.getEmail(),
				"userId", user.getId().toString(),
				"role", user.getRole() != null ? user.getRole() : "USER"
			));
		} catch (AuthenticationException e) {
			return ResponseEntity.status(401).body("Invalid credentials");
		}
	}

	private static final String ADMIN_SECRET_CODE = "FITNEXUS-ADMIN-2026";

	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
		String role = body.getOrDefault("role", "USER").trim();

		// Admin registration requires a valid secret code
		if ("ADMIN".equalsIgnoreCase(role)) {
			String adminCode = body.get("adminCode");
			if (adminCode == null || !ADMIN_SECRET_CODE.equals(adminCode.trim())) {
				return ResponseEntity.status(403).body("Invalid admin registration code. Contact the system administrator.");
			}
		}

		User user = new User();
		user.setUsername(body.get("username"));
		user.setEmail(body.get("email"));
		user.setPassword(body.get("password"));
		user.setRole(role.isEmpty() ? "USER" : role);

		userRepo.save(user);
		return ResponseEntity.ok("User registered successfully");
	}
}
