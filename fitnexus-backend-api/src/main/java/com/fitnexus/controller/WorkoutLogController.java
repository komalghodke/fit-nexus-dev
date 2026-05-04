package com.fitnexus.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitnexus.entity.WorkoutLog;
import com.fitnexus.repository.WorkoutLogRepository;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutLogController {

	@Autowired
	private WorkoutLogRepository workoutLogRepository;

	@GetMapping("/{userId}")
	public List<WorkoutLog> getWorkouts(@PathVariable("userId") Long userId) {
		return workoutLogRepository.findByUserId(userId);
	}

	@PostMapping
	public WorkoutLog addWorkout(@RequestBody WorkoutLog workoutLog) {
		return workoutLogRepository.save(workoutLog);
	}

//	@PutMapping("/{id}")
//	public WorkoutLog updateWorkout(@PathVariable("id") Long id, @RequestBody WorkoutLog workoutLog) {
//		workoutLog.setId(id);
//		return workoutLogRepository.save(workoutLog);
//	}

	@PutMapping("/{id}")
	public WorkoutLog updateWorkout(@PathVariable("id") Long id, @RequestBody WorkoutLog workoutLog) {
		WorkoutLog existing = workoutLogRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Workout not found with id " + id));

		existing.setExerciseType(workoutLog.getExerciseType());
		existing.setDuration(workoutLog.getDuration());
		existing.setCaloriesBurned(workoutLog.getCaloriesBurned());
		existing.setDate(workoutLog.getDate());
		existing.setUser(workoutLog.getUser());

		return workoutLogRepository.save(existing);
	}

	@DeleteMapping("/{id}")
	public void deleteWorkout(@PathVariable("id") Long id) {
		workoutLogRepository.deleteById(id);
	}

}
