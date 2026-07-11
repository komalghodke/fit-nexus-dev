package com.fitnexus.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    @Value("${serpapi.key:YOUR_SERPAPI_API_KEY}")
    private String serpApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping
    public ResponseEntity<?> getLocations(
            @RequestParam(value = "query", defaultValue = "yoga") String query,
            @RequestParam(value = "lat", defaultValue = "18.5204") double lat,
            @RequestParam(value = "lng", defaultValue = "73.8567") double lng) {

        // If the key is not set or is the placeholder, return a message or fall back
        if (serpApiKey == null || serpApiKey.trim().isEmpty() || "YOUR_SERPAPI_API_KEY".equals(serpApiKey)) {
            return ResponseEntity.ok(Map.of(
                "source", "fallback",
                "results", getFallbackLocations(query)
            ));
        }

        try {
            // Google Maps Search Engine url format for SerpApi
            String url = String.format(
                "https://serpapi.com/search.json?engine=google_maps&q=%s&ll=@%f,%f,13z&type=search&api_key=%s",
                query, lat, lng, serpApiKey
            );

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("local_results")) {
                List<Map<String, Object>> localResults = (List<Map<String, Object>>) response.get("local_results");
                List<Map<String, Object>> enrichedResults = new ArrayList<>();

                for (Map<String, Object> place : localResults) {
                    Map<String, Object> gps = (Map<String, Object>) place.get("gps_coordinates");
                    double plat = gps != null && gps.get("latitude") != null ? ((Number) gps.get("latitude")).doubleValue() : lat;
                    double plng = gps != null && gps.get("longitude") != null ? ((Number) gps.get("longitude")).doubleValue() : lng;

                    enrichedResults.add(Map.of(
                        "name", place.getOrDefault("title", "Unknown Center"),
                        "type", determineType(query),
                        "lat", plat,
                        "lng", plng,
                        "address", place.getOrDefault("address", "Address not available"),
                        "rating", place.getOrDefault("rating", 4.0),
                        "reviews", place.getOrDefault("reviews", 0),
                        "phone", place.getOrDefault("phone", "N/A"),
                        "desc", place.getOrDefault("description", "A fitness and wellness space."),
                        "website", place.getOrDefault("website", "")
                    ));
                }

                return ResponseEntity.ok(Map.of(
                    "source", "serpapi",
                    "results", enrichedResults
                ));
            }
        } catch (Exception e) {
            // Log error and fall back gracefully
            System.err.println("SerpApi lookup failed: " + e.getMessage());
        }

        return ResponseEntity.ok(Map.of(
            "source", "fallback_on_error",
            "results", getFallbackLocations(query)
        ));
    }

    private String determineType(String query) {
        String q = query.toLowerCase();
        if (q.contains("gym") || q.contains("fitness") || q.contains("workout")) return "GYM";
        if (q.contains("ayush") || q.contains("ayurved") || q.contains("hospital") || q.contains("wellness")) return "WELLNESS";
        return "YOGA";
    }

    private List<Map<String, Object>> getFallbackLocations(String query) {
        String type = determineType(query);
        List<Map<String, Object>> all = new ArrayList<>();

        all.add(Map.of(
            "name", "Ramamani Iyengar Memorial Yoga Institute",
            "type", "YOGA", "lat", 18.5358, "lng", 73.8398,
            "address", "1107 B/1, Hare Krishna Mandir Road, Shivaji Nagar, Pune",
            "rating", 4.9, "reviews", 142, "phone", "+91 20 2565 6137",
            "desc", "World-renowned institute founded by B.K.S. Iyengar, focusing on precision and alignment."
        ));
        all.add(Map.of(
            "name", "Osho Meditation Resort",
            "type", "YOGA", "lat", 18.5372, "lng", 73.8912,
            "address", "17, Koregaon Park Road, Koregaon Park, Pune",
            "rating", 4.6, "reviews", 328, "phone", "+91 20 6601 9999",
            "desc", "A beautiful oasis of calm offering dynamic meditation programs, Zen gardens, and spiritual retreats."
        ));
        all.add(Map.of(
            "name", "Gold's Gym Kalyani Nagar",
            "type", "GYM", "lat", 18.5492, "lng", 73.9038,
            "address", "3rd Floor, Mariplex Mall, Kalyani Nagar, Pune",
            "rating", 4.5, "reviews", 215, "phone", "+91 20 6620 9000",
            "desc", "State-of-the-art strength training, cardiovascular equipment, and certified fitness coaches."
        ));
        all.add(Map.of(
            "name", "Patanjali Arogya Kendra",
            "type", "WELLNESS", "lat", 18.5323, "lng", 73.8540,
            "address", "Shop No. 4, Shivaji Nagar, Opp. Railway Station, Pune",
            "rating", 4.3, "reviews", 95, "phone", "+91 1800 180 4108",
            "desc", "Authentic Ayurvedic doctor consultations, herbal medicines, and traditional therapy products."
        ));

        // Filter based on type to simulate search
        List<Map<String, Object>> filtered = new ArrayList<>();
        for (Map<String, Object> item : all) {
            if (type.equals(item.get("type"))) {
                filtered.add(item);
            }
        }
        return filtered.isEmpty() ? all : filtered;
    }
}
