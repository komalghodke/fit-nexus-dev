package com.fitnexus.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fitnexus.entity.WorkoutLog;

public interface WorkoutLogRepository extends JpaRepository<WorkoutLog, Long> {
	List<WorkoutLog> findByUserId(Long userId);
}
