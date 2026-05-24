package com.fitnexus.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.fitnexus.dto.AuthRequest;
import com.fitnexus.entity.User;
import com.fitnexus.repository.UserRepository;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    // Load user for Spring Security
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        // Use Spring Security's User class, not your entity
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
				.authorities("USER").build();
	}
    
    public void registerUser(AuthRequest request) {
        User user = new User();
        user.setEmail(request.getUsername());
        user.setPassword(request.getPassword());
        userRepository.saveAndFlush(user); // force commit immediately
    }

}