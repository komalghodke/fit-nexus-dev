package com.fitnexus.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitnexus.entity.Nutrition;
import com.fitnexus.entity.User;
import com.fitnexus.repository.NutritionRepository;
import com.fitnexus.repository.UserRepository;

@RestController
@RequestMapping("/api/nutrition")
@CrossOrigin(origins = "http://localhost:3000")
public class NutritionController {

	@Autowired
	private NutritionRepository nutritionRepository;

	@Autowired
	private UserRepository userRepository;

	@GetMapping("/{userId}")
	public List<Nutrition> getNutrition(@PathVariable("userId") Long userId) {
		return nutritionRepository.findByUserId(userId);
	}

	@PostMapping("/{userId}")
	public Nutrition addNutrition(@PathVariable("userId") Long userId, @RequestBody Map<String, Object> payload) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
		
		Nutrition nutrition = new Nutrition();
		nutrition.setUser(user);
		
		String food = (String) payload.get("food");
		String meal = (String) payload.get("meal");
		nutrition.setMeal(food != null ? food : (meal != null ? meal : "General Meal"));
		
		Object caloriesObj = payload.get("calories");
		if (caloriesObj != null && !caloriesObj.toString().isEmpty()) {
			try {
				nutrition.setCalories(Integer.parseInt(caloriesObj.toString()));
			} catch (NumberFormatException e) {
				nutrition.setCalories(0);
			}
		}
		
		nutrition.setNotes((String) payload.get("notes"));
		nutrition.setCreatedAt(LocalDateTime.now());
		
		return nutritionRepository.save(nutrition);
	}
}
