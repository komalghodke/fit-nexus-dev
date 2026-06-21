package com.fitnexus.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fitnexus.entity.Sleep;

public interface SleepRepository extends JpaRepository<Sleep, Long> {
	List<Sleep> findByUserId(Long userId);
}
