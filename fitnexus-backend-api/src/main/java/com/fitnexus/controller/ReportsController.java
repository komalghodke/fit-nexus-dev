package com.fitnexus.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitnexus.dto.WellnessReport;
import com.fitnexus.service.ReportsService;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

	@Autowired
	private ReportsService reportsService;

	@GetMapping("/{userId}")
	public WellnessReport getReport(@PathVariable("userId") Long userId) {
		return reportsService.generateReport(userId);
	}

}
