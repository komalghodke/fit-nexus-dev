package com.fitnexus.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fitnexus.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

	Optional<User> findByUsername(String username);
}