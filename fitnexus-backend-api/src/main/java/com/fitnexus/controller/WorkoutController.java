package com.fitnexus.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitnexus.entity.User;
import com.fitnexus.entity.Workout;
import com.fitnexus.repository.UserRepository;
import com.fitnexus.repository.WorkoutRepository;

@RestController
@RequestMapping("/api/workout")
@CrossOrigin(origins = "http://localhost:3000")
public class WorkoutController {

	@Autowired
	private WorkoutRepository workoutRepository;

	@Autowired
	private UserRepository userRepository;

	@GetMapping("/{userId}")
	public List<Workout> getWorkouts(@PathVariable("userId") Long userId) {
		return workoutRepository.findByUserId(userId);
	}

	@PostMapping("/{userId}")
	public Workout addWorkout(@PathVariable("userId") Long userId, @RequestBody Workout workout) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
		workout.setUser(user);
		workout.setCreatedAt(LocalDateTime.now());
		return workoutRepository.save(workout);
	}

	@PutMapping("/{id}")
	public Workout updateWorkout(@PathVariable("id") Long id, @RequestBody Workout workout) {
		Workout existing = workoutRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Workout not found with ID " + id));

		existing.setType(workout.getType());
		existing.setDuration(workout.getDuration());
		existing.setIntensity(workout.getIntensity());

		return workoutRepository.save(existing);
	}

	@DeleteMapping("/{id}")
	public void deleteWorkout(@PathVariable("id") Long id) {
		workoutRepository.deleteById(id);
	}
}
