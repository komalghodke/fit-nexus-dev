package com.fitnexus.controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitnexus.dto.WellnessRequest;
import com.fitnexus.entity.Nutrition;
import com.fitnexus.entity.Sleep;
import com.fitnexus.entity.Stress;
import com.fitnexus.entity.User;
import com.fitnexus.entity.WellnessInput;
import com.fitnexus.entity.Workout;
import com.fitnexus.repository.NutritionRepository;
import com.fitnexus.repository.SleepRepository;
import com.fitnexus.repository.StressRepository;
import com.fitnexus.repository.UserRepository;
import com.fitnexus.repository.WellnessInputRepository;
import com.fitnexus.repository.WorkoutRepository;
import com.fitnexus.service.ReportsService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class WellnessController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private WellnessInputRepository wellnessInputRepository;

	@Autowired
	private WorkoutRepository workoutRepository;

	@Autowired
	private NutritionRepository nutritionRepository;

	@Autowired
	private SleepRepository sleepRepository;

	@Autowired
	private StressRepository stressRepository;

	@PostMapping("/wellness/{userId}")
	public ResponseEntity<String> saveWellness(@PathVariable("userId") Long userId,
			@RequestBody WellnessRequest request) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

		// Save WellnessInput
		WellnessInput input = wellnessInputRepository.findByUserId(userId).orElse(new WellnessInput());
		input.setUserId(userId);
		input.setFullName(request.getFullName());
		input.setEmail(request.getEmail());
		input.setMobileNumber(request.getMobileNumber());
		input.setGender(request.getGender());
		input.setCity(request.getCity());
		input.setAge(request.getAge());
		input.setHeight(request.getHeight());
		input.setWeight(request.getWeight());
		input.setWaterIntake(request.getWaterIntake());
		input.setDigestiveIssues(request.getDigestiveIssues());
		input.setPainArea(request.getPainArea());
		input.setMood(request.getMood());
		input.setStressLevel(request.getStressLevel());
		input.setSleepHours(request.getSleepHours() != null ? request.getSleepHours().doubleValue() : null);
		input.setSleepQuality(request.getSleepQuality());
		input.setSleep(request.getSleep());
		input.setInnerPeace(request.getInnerPeace());
		input.setSocialSupport(request.getSocialSupport());
		input.setWorkSatisfaction(request.getWorkSatisfaction());
		input.setWithNature(request.getWithNature());
		input.setHasDisease(request.getHasDisease());
		input.setWorkoutType(request.getWorkoutType());
		input.setWorkoutDuration(request.getWorkoutDuration());
		input.setWorkoutFrequency(request.getWorkoutFrequency());
		input.setDailyCalories(request.getDailyCalories());
		input.setProteinIntake(request.getProteinIntake());
		input.setFruitServings(request.getFruitServings());
		input.setVegetableServings(request.getVegetableServings());
		input.setBedtime(request.getBedtime());
		input.setWakeTime(request.getWakeTime());
		input.setStressTriggers(request.getStressTriggers());
		input.setRelaxationPractice(request.getRelaxationPractice());
		input.setSmoking(request.getSmoking());
		input.setAlcohol(request.getAlcohol());
		input.setScreenTime(request.getScreenTime());
		input.setPhysicalActivity(request.getPhysicalActivity());
		input.setMeditationMinutes(request.getMeditationMinutes());
		input.setEnergyLevel(request.getEnergyLevel());
		input.setChronicConditions(request.getChronicConditions());
		input.setMedications(request.getMedications());
		input.setBmi(request.getBmi());
		input.setYogaExperience(request.getYogaExperience());
		input.setDaysPerWeek(request.getDaysPerWeek());
		input.setMinutesPerSession(request.getMinutesPerSession());
		input.setJournalEntry(request.getJournalEntry());
		input.setRestingHeartRate(request.getRestingHeartRate());

		wellnessInputRepository.save(input);

		// Optionally auto-create Workout log if duration is logged
		if ((request.getWorkoutDuration() != null && request.getWorkoutDuration() > 0)
				|| (request.getWorkoutType() != null && !request.getWorkoutType().isEmpty())) {
			Workout w = new Workout();
			w.setUser(user);
			w.setType(request.getWorkoutType() != null && !request.getWorkoutType().isEmpty() ? request.getWorkoutType()
					: "General");
			w.setDuration(request.getWorkoutDuration() != null ? request.getWorkoutDuration() : 0);
			w.setIntensity("Medium");
			w.setCreatedAt(LocalDateTime.now());
			workoutRepository.save(w);
		}

		// Optionally auto-create Nutrition log if calories are logged
		if (request.getDailyCalories() != null && request.getDailyCalories() > 0) {
			Nutrition n = new Nutrition();
			n.setUser(user);
			n.setMeal("Form Entry Log");
			n.setCalories(request.getDailyCalories());
			n.setNotes("Water: " + (request.getWaterIntake() != null ? request.getWaterIntake() : 0.0) + "L, Protein: " + (request.getProteinIntake() != null ? request.getProteinIntake() : 0) + "g");
			n.setCreatedAt(LocalDateTime.now());
			nutritionRepository.save(n);
		}

		// Optionally auto-create Sleep log if sleep hours logged
		if (request.getSleepHours() != null && request.getSleepHours() > 0) {
			Sleep s = new Sleep();
			s.setUser(user);
			s.setHours(request.getSleepHours());
			s.setQuality(request.getSleepQuality() != null ? request.getSleepQuality() : "Good");
			s.setCreatedAt(LocalDateTime.now());
			sleepRepository.save(s);
		}

		// Optionally auto-create Stress log if stress logged
		if (request.getStressLevel() != null && request.getStressLevel() > 0) {
			Stress str = new Stress();
			str.setUser(user);
			str.setLevel(String.valueOf(request.getStressLevel()));
			str.setNotes(request.getStressTriggers() != null ? request.getStressTriggers() : "Form Entry");
			str.setCreatedAt(LocalDateTime.now());
			stressRepository.save(str);
		}

		return ResponseEntity.ok("Wellness data saved");
	}

//	@GetMapping("/reports/{userId}")
//	public ResponseEntity<WellnessReport> getReport(@PathVariable("userId") Long userId) {
//		WellnessReport report = reportsService.generateReport(userId);
//		return ResponseEntity.ok(report);
//	}
}