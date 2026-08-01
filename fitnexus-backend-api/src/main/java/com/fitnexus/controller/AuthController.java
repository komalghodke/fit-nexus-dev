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
		if (req.getEmail() == null || req.getEmail().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("Email is required");
		}
		if (req.getPassword() == null || req.getPassword().isEmpty()) {
			return ResponseEntity.badRequest().body("Password is required");
		}

		try {
			String normalizedEmail = req.getEmail().trim().toLowerCase();
			authManager.authenticate(
				    new UsernamePasswordAuthenticationToken(normalizedEmail, req.getPassword())
				);
			User user = userRepo.findByEmail(req.getEmail().trim())
					.orElseGet(() -> userRepo.findByEmail(normalizedEmail)
					.orElseThrow(() -> new RuntimeException("User not found with email: " + req.getEmail())));

			String userRole = user.getRole() != null ? user.getRole().trim().toUpperCase() : "USER";

			// Mandatory Portal Role Isolation Validation
			String portalRole = req.getPortalRole();
			String requestedPortal = (portalRole != null && !portalRole.trim().isEmpty())
					? portalRole.trim().toUpperCase()
					: "USER";

			boolean roleMatch = false;
			if ("USER".equals(requestedPortal)) {
				roleMatch = "USER".equals(userRole);
			} else if ("YOGA_INSTRUCTOR".equals(requestedPortal)) {
				roleMatch = "YOGA_INSTRUCTOR".equals(userRole);
			} else if ("GYM_TRAINER".equals(requestedPortal)) {
				roleMatch = "GYM_TRAINER".equals(userRole);
			} else if ("ADMIN".equals(requestedPortal)) {
				roleMatch = "ADMIN".equals(userRole);
			}

			if (!roleMatch) {
				String userRoleDisplay = userRole.replace("_", " ");
				String requestedPortalDisplay = requestedPortal.replace("_", " ");
				return ResponseEntity.status(401).body(
					"Access denied. Your account is registered as " + userRoleDisplay
					+ ". You cannot log in through the " + requestedPortalDisplay + " portal."
				);
			}

			String token = jwtUtil.generateToken(user.getEmail().trim().toLowerCase());
			return ResponseEntity.ok(Map.of(
				"token", token,
				"email", user.getEmail(),
				"userId", user.getId().toString(),
				"role", userRole
			));
		} catch (AuthenticationException e) {
			return ResponseEntity.status(401).body("Invalid email or password");
		}
	}

	private static final String ADMIN_SECRET_CODE = "FITNEXUS-ADMIN-2026";
	private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@(.+)$";

	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
		String username = body.get("username");
		String email = body.get("email");
		String password = body.get("password");
		String role = body.getOrDefault("role", "USER").trim();

		// 1. Validation checks
		if (username == null || username.trim().isEmpty()) {
			return ResponseEntity.badRequest().body("Username is required");
		}
		if (email == null || email.trim().isEmpty() || !email.trim().matches(EMAIL_REGEX)) {
			return ResponseEntity.badRequest().body("Valid email address is required");
		}
		if (password == null || password.trim().length() < 6) {
			return ResponseEntity.badRequest().body("Password must be at least 6 characters");
		}

		String normalizedEmail = email.trim().toLowerCase();
		if (userRepo.findByEmail(normalizedEmail).isPresent() || userRepo.findByEmail(email.trim()).isPresent()) {
			return ResponseEntity.badRequest().body("Email is already registered. Please log in.");
		}

		// Admin registration requires a valid secret code
		if ("ADMIN".equalsIgnoreCase(role)) {
			String adminCode = body.get("adminCode");
			if (adminCode == null || !ADMIN_SECRET_CODE.equals(adminCode.trim())) {
				return ResponseEntity.status(403).body("Invalid admin registration code. Contact the system administrator.");
			}
		}

		User user = new User();
		user.setUsername(username.trim());
		user.setEmail(normalizedEmail);
		user.setPassword(password);
		user.setRole(role.isEmpty() ? "USER" : role);

		userRepo.save(user);
		return ResponseEntity.ok("User registered successfully");
	}
}
