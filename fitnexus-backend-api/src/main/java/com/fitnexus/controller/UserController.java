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

@RestController
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserRepository userRepository;

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


}
