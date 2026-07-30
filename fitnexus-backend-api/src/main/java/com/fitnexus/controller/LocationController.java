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

                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("name", place.getOrDefault("title", "Unknown Center"));
                    map.put("type", determineType(query));
                    map.put("lat", plat);
                    map.put("lng", plng);
                    map.put("address", place.getOrDefault("address", "Address not available"));
                    map.put("rating", place.getOrDefault("rating", 4.0));
                    map.put("reviews", place.getOrDefault("reviews", 0));
                    map.put("phone", place.getOrDefault("phone", "N/A"));
                    map.put("desc", place.getOrDefault("description", "A fitness and wellness space."));
                    map.put("website", place.getOrDefault("website", ""));
                    map.put("thumbnail", place.getOrDefault("thumbnail", ""));
                    enrichedResults.add(map);
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
        List<Map<String, Object>> all = new ArrayList<>();

        // ── 1. MUMBAI ──
        all.add(Map.of(
            "name", "The Yoga Institute (World's Oldest Center)",
            "type", "YOGA", "lat", 19.0833, "lng", 72.8465,
            "address", "Shri Yogendra Marg, Prabhat Colony, Santacruz East, Mumbai, Maharashtra 400055",
            "rating", 4.9, "reviews", 640, "phone", "+91 22 2611 0506",
            "desc", "Founded in 1918, the world's oldest organized yoga center offering classical Hatha & Householder Yoga.",
            "thumbnail", "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80"
        ));
        all.add(Map.of(
            "name", "Kaivalyadhama Yoga Institute Mumbai",
            "type", "YOGA", "lat", 18.9482, "lng", 72.8258,
            "address", "Taraporevala Aquarium Campus, Netaji Subhash Road, Marine Drive, Mumbai 400002",
            "rating", 4.8, "reviews", 310, "phone", "+91 22 2281 8417",
            "desc", "Scientific research-backed traditional yoga school providing pranayama, therapy, and meditation.",
            "thumbnail", "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
        ));
        all.add(Map.of(
            "name", "Gold's Gym Bandra",
            "type", "GYM", "lat", 19.0600, "lng", 72.8362,
            "address", "Waterfield Road, Bandra West, Mumbai, Maharashtra 400050",
            "rating", 4.6, "reviews", 480, "phone", "+91 22 6699 9999",
            "desc", "Premium fitness facility with strength training, HIIT zone, and celebrity personal trainers.",
            "thumbnail", "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80"
        ));

        // ── 2. DELHI NCR ──
        all.add(Map.of(
            "name", "Morarji Desai National Institute of Yoga (MDNIY)",
            "type", "YOGA", "lat", 28.6219, "lng", 77.2144,
            "address", "68, Ashoka Road, Near GPO, Connaught Place, New Delhi 110001",
            "rating", 4.8, "reviews", 820, "phone", "+91 11 2373 0417",
            "desc", "Autonomous apex institute under Ministry of AYUSH offering certified yoga therapy & education.",
            "thumbnail", "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80"
        ));
        all.add(Map.of(
            "name", "Sivananda Yoga Vedanta Centre Delhi",
            "type", "YOGA", "lat", 28.5524, "lng", 77.2415,
            "address", "S-75, Kailash Colony, Greater Kailash, New Delhi 110048",
            "rating", 4.7, "reviews", 290, "phone", "+91 11 2924 8813",
            "desc", "Classic Sivananda 5-points yoga system, vegetarian nutrition guidance, and deep meditation.",
            "thumbnail", "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
        ));
        all.add(Map.of(
            "name", "Cult.fit Connaught Place",
            "type", "GYM", "lat", 28.6315, "lng", 77.2167,
            "address", "Outer Circle, Block E, Connaught Place, New Delhi 110001",
            "rating", 4.7, "reviews", 520, "phone", "+91 1800 572 6300",
            "desc", "Group workouts, HRX training, boxing, yoga, and athletic conditioning sessions.",
            "thumbnail", "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80"
        ));

        // ── 3. RISHIKESH & HARIDWAR (YOGA CAPITAL) ──
        all.add(Map.of(
            "name", "Parmarth Niketan Ashram Rishikesh",
            "type", "YOGA", "lat", 30.1219, "lng", 78.3142,
            "address", "Main Market Road, Ram Jhula, Swarg Ashram, Rishikesh, Uttarakhand 249137",
            "rating", 4.9, "reviews", 1850, "phone", "+91 135 243 4301",
            "desc", "World's iconic spiritual ashram along Ganga bank hosting International Yoga Festival & Ganga Aarti.",
            "thumbnail", "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80"
        ));
        all.add(Map.of(
            "name", "Patanjali Yogpeeth Haridwar",
            "type", "WELLNESS", "lat", 29.9457, "lng", 78.1642,
            "address", "Delhi-Haridwar National Highway, Near Bahadrabad, Haridwar, Uttarakhand 249405",
            "rating", 4.8, "reviews", 2400, "phone", "+91 1334 240 008",
            "desc", "India's premier Ayurvedic medical institute, Panchakarma therapy center, and Yoga research hub.",
            "thumbnail", "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80"
        ));

        // ── 4. BENGALURU ──
        all.add(Map.of(
            "name", "S-VYASA Yoga University Bengaluru",
            "type", "YOGA", "lat", 12.7844, "lng", 77.5847,
            "address", "Prashanti Kutiram, Jigani Industrial Area, Bengaluru, Karnataka 560105",
            "rating", 4.9, "reviews", 980, "phone", "+91 80 2263 9968",
            "desc", "World-renowned deemed university for yoga therapy research, Cyclic Meditation, and Ayurvedic care.",
            "thumbnail", "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
        ));
        all.add(Map.of(
            "name", "Soukya Holistic Health Centre Bengaluru",
            "type", "WELLNESS", "lat", 12.9866, "lng", 77.7499,
            "address", "Samethanahalli, Whitefield, Bengaluru, Karnataka 560067",
            "rating", 4.8, "reviews", 340, "phone", "+91 80 2801 7000",
            "desc", "Integrative medical facility combining Ayurveda, Homeopathy, Naturopathy, and Yoga therapy.",
            "thumbnail", "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80"
        ));
        all.add(Map.of(
            "name", "Cult.fit Koramangala",
            "type", "GYM", "lat", 12.9352, "lng", 77.6245,
            "address", "80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034",
            "rating", 4.7, "reviews", 710, "phone", "+91 1800 572 6300",
            "desc", "High-energy group workouts, S&C equipment, spin studio, and certified nutrition coaches.",
            "thumbnail", "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80"
        ));

        // ── 5. CHENNAI ──
        all.add(Map.of(
            "name", "Krishnamacharya Yoga Mandiram (KYM)",
            "type", "YOGA", "lat", 13.0382, "lng", 80.2520,
            "address", "New No 31, 4th Cross St, RK Nagar, Raja Annamalai Puram, Chennai, Tamil Nadu 600028",
            "rating", 4.9, "reviews", 540, "phone", "+91 44 2493 7998",
            "desc", "Pioneering Viniyoga therapy institute established by T.K.V. Desikachar, son of T. Krishnamacharya.",
            "thumbnail", "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80"
        ));

        // ── 6. PUNE ──
        all.add(Map.of(
            "name", "Ramamani Iyengar Memorial Yoga Institute",
            "type", "YOGA", "lat", 18.5358, "lng", 73.8398,
            "address", "1107 B/1, Hare Krishna Mandir Road, Shivaji Nagar, Pune, Maharashtra 411016",
            "rating", 4.9, "reviews", 640, "phone", "+91 20 2565 6137",
            "desc", "World-renowned institute founded by B.K.S. Iyengar, focusing on structural alignment & props.",
            "thumbnail", "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80"
        ));
        all.add(Map.of(
            "name", "Osho Meditation Resort Pune",
            "type", "YOGA", "lat", 18.5372, "lng", 73.8912,
            "address", "17, Koregaon Park Road, Koregaon Park, Pune, Maharashtra 411001",
            "rating", 4.6, "reviews", 528, "phone", "+91 20 6601 9999",
            "desc", "A sanctuary offering dynamic meditation, mindfulness programs, and Zen gardens.",
            "thumbnail", "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
        ));
        all.add(Map.of(
            "name", "Gold's Gym Kalyani Nagar Pune",
            "type", "GYM", "lat", 18.5492, "lng", 73.9038,
            "address", "3rd Floor, Mariplex Mall, Kalyani Nagar, Pune, Maharashtra 411006",
            "rating", 4.5, "reviews", 315, "phone", "+91 20 6620 9000",
            "desc", "State-of-the-art strength training, cardio floor, and certified fitness coaches.",
            "thumbnail", "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80"
        ));

        // ── 7. KOLKATA ──
        all.add(Map.of(
            "name", "Ghosh Yoga College Kolkata",
            "type", "YOGA", "lat", 22.5855, "lng", 88.3698,
            "address", "4/2, Rammohan Roy Sarani, Amherst Street, Kolkata, West Bengal 700009",
            "rating", 4.8, "reviews", 280, "phone", "+91 33 2350 4910",
            "desc", "Historic physical culture and yoga institution founded by Bishnu Charan Ghosh (Bikram's guru).",
            "thumbnail", "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80"
        ));

        // ── 8. HYDERABAD ──
        all.add(Map.of(
            "name", "Bharat Thakur Artistic Yoga Hyderabad",
            "type", "YOGA", "lat", 17.4325, "lng", 78.4070,
            "address", "Road No 36, Jubilee Hills, Hyderabad, Telangana 500033",
            "rating", 4.7, "reviews", 390, "phone", "+91 40 6678 1234",
            "desc", "Dynamic artistic yoga combining ancient postures, cardio conditioning, and breathwork.",
            "thumbnail", "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
        ));

        if (query == null || query.trim().isEmpty() || "all".equalsIgnoreCase(query) || "wellness".equalsIgnoreCase(query) || "fitness".equalsIgnoreCase(query) || "yoga".equalsIgnoreCase(query)) {
            return all;
        }

        List<Map<String, Object>> filtered = new ArrayList<>();
        for (Map<String, Object> item : all) {
            String name = ((String) item.get("name")).toLowerCase();
            String address = ((String) item.get("address")).toLowerCase();
            String itemType = ((String) item.get("type")).toLowerCase();
            String q = query.toLowerCase();
            if (name.contains(q) || address.contains(q) || itemType.contains(q)) {
                filtered.add(item);
            }
        }
        return filtered.isEmpty() ? all : filtered;
    }
}
