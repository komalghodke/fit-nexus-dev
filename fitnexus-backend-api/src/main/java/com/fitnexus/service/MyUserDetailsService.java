package com.fitnexus.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.fitnexus.entity.User;
import com.fitnexus.repository.UserRepository;

@Service
public class MyUserDetailsService implements UserDetailsService {

	@Autowired
	private UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		User user = userRepository.findByEmail(email)
				.orElseGet(() -> userRepository.findByEmail(email.toLowerCase().trim())
				.orElseThrow(() -> new UsernameNotFoundException("User not found: " + email)));

		return org.springframework.security.core.userdetails.User.withUsername(user.getEmail().trim().toLowerCase())
				.password(user.getPassword()).authorities(user.getRole() != null ? user.getRole() : "USER").build();
	}
}
