package com.fitnexus.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.fitnexus.dto.WellnessReport;
import com.fitnexus.entity.User;
import com.fitnexus.repository.UserRepository;
import com.fitnexus.service.ReportsService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/reports")
public class ReportsController {

	@Autowired
	private ReportsService reportsService;

	@Autowired
	private UserRepository userRepository;

	@GetMapping("/profile/{email}")
	public WellnessReport getReportByEmail(@PathVariable("email") String email) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found with email " + email));
		return reportsService.generateReport(user.getId());
	}
    @GetMapping("/{userId}")
    public WellnessReport getReportByUserId(@PathVariable("userId") Long userId) {
        return reportsService.generateReport(userId);
    }
}
