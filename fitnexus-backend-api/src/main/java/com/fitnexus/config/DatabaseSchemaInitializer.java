package com.fitnexus.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;

@Component
public class DatabaseSchemaInitializer {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void initSchema() {
        String[] tables = {"users", "workouts", "sleep", "stress", "nutrition", "wellness_inputs", "feedback"};
        for (String table : tables) {
            try {
                jdbcTemplate.execute("ALTER TABLE " + table + " MODIFY COLUMN id BIGINT AUTO_INCREMENT");
                System.out.println("[FITNEXUS DB MIGRATION] Successfully ensured AUTO_INCREMENT on " + table + ".id column.");
            } catch (Exception e) {
                System.err.println("[FITNEXUS DB MIGRATION LOG] " + table + ".id column check: " + e.getMessage());
            }
        }
    }
}
