package com.fitnexus.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.fitnexus.entity.WellnessInput;

public interface WellnessInputRepository extends JpaRepository<WellnessInput, Long> {
	Optional<WellnessInput> findByUserId(Long userId);
}
