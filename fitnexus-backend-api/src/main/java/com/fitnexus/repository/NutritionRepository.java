package com.fitnexus.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fitnexus.entity.Nutrition;

public interface NutritionRepository extends JpaRepository<Nutrition, Long> {
	List<Nutrition> findByUserId(Long userId);
}
