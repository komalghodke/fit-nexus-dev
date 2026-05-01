package com.fitnexus.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fitnexus.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
