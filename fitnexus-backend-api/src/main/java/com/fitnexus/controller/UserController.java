package com.fitnexus.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitnexus.entity.User;
import com.fitnexus.repository.UserRepository;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.fitnexus.repository.WellnessInputRepository;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private WellnessInputRepository wellnessInputRepository;

	@Autowired
	private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

	@jakarta.annotation.PostConstruct
	public void initSchema() {
		try {
			jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN staff_notes TEXT");
			System.out.println("[FITNEXUS DB MIGRATION] Successfully updated users.staff_notes to TEXT column type.");
		} catch (Exception e) {
			System.err.println("[FITNEXUS DB MIGRATION LOG] staff_notes column check: " + e.getMessage());
		}
	}

	@GetMapping
	public List<User> getAllUsers() {
		return userRepository.findAll();
	}

	@GetMapping("/{id}")
	public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
		return userRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@GetMapping("/profile/{email}")
	public ResponseEntity<User> getUserByEmail(@PathVariable("email") String email) {
		return userRepository.findByEmail(email).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@PutMapping("/profile/{email}")
	public ResponseEntity<User> updateUserByEmail(@PathVariable("email") String email, @RequestBody User user) {
	    User existing = userRepository.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("User not found with email " + email));

	    existing.setUsername(user.getUsername());
	    existing.setPassword(user.getPassword()); 
	    return ResponseEntity.ok(userRepository.save(existing));
	}

	@PutMapping("/{id}/role")
	public ResponseEntity<User> updateUserRole(@PathVariable("id") Long id, @RequestParam("role") String role) {
		User existing = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found with ID " + id));
		existing.setRole(role);
		return ResponseEntity.ok(userRepository.save(existing));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteUser(@PathVariable("id") Long id) {
		User existing = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found with ID " + id));
		userRepository.delete(existing);
		return ResponseEntity.ok("User deleted successfully");
	}

	@GetMapping("/stats")
	public ResponseEntity<Map<String, Object>> getSystemStats() {
		long totalUsers = userRepository.count();
		long totalAssessments = wellnessInputRepository.count();
		
		long userCount = userRepository.findAll().stream().filter(u -> "USER".equalsIgnoreCase(u.getRole()) || u.getRole() == null).count();
		long yogaCount = userRepository.findAll().stream().filter(u -> "YOGA_INSTRUCTOR".equalsIgnoreCase(u.getRole())).count();
		long gymCount = userRepository.findAll().stream().filter(u -> "GYM_TRAINER".equalsIgnoreCase(u.getRole())).count();
		long adminCount = userRepository.findAll().stream().filter(u -> "ADMIN".equalsIgnoreCase(u.getRole())).count();

		Map<String, Object> stats = new HashMap<>();
		stats.put("totalUsers", totalUsers);
		stats.put("totalAssessments", totalAssessments);
		stats.put("userCount", userCount);
		stats.put("yogaCount", yogaCount);
		stats.put("gymCount", gymCount);
		stats.put("adminCount", adminCount);

		return ResponseEntity.ok(stats);
	}

	@PutMapping("/{id}/notes")
	public ResponseEntity<User> updateStaffNotes(@PathVariable("id") Long id, @RequestBody Map<String, String> body) {
		User existing = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found with ID " + id));
		existing.setStaffNotes(body.get("notes"));
		return ResponseEntity.ok(userRepository.save(existing));
	}
}
