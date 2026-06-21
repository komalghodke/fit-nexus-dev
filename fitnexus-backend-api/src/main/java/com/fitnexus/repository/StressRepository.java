package com.fitnexus.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fitnexus.entity.Stress;

public interface StressRepository extends JpaRepository<Stress, Long> {
	List<Stress> findByUserId(Long userId);
}
