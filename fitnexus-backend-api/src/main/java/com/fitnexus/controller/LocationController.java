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

    private Map<String, Object> createLoc(
            String name, String type, double lat, double lng, String address, double rating, int reviews, String phone,
            String desc, String thumbnail, boolean isAyush, boolean isYcb, String regNo, String title, String services) {
        Map<String, Object> map = new java.util.HashMap<>();
        map.put("name", name);
        map.put("type", type);
        map.put("lat", lat);
        map.put("lng", lng);
        map.put("address", address);
        map.put("rating", rating);
        map.put("reviews", reviews);
        map.put("phone", phone);
        map.put("desc", desc);
        map.put("thumbnail", thumbnail);
        map.put("isAyushCertified", isAyush);
        map.put("isYcbApproved", isYcb);
        if (regNo != null) map.put("ayushRegNo", regNo);
        if (title != null) map.put("certificationTitle", title);
        if (services != null) map.put("ayushServices", services);
        return map;
    }

    private List<Map<String, Object>> getFallbackLocations(String query) {
        List<Map<String, Object>> all = new ArrayList<>();

        // ── 1. MUMBAI ──
        all.add(createLoc(
            "The Yoga Institute (World's Oldest Center)",
            "YOGA", 19.0833, 72.8465,
            "Shri Yogendra Marg, Prabhat Colony, Santacruz East, Mumbai, Maharashtra 400055",
            4.9, 640, "+91 22 2611 0506",
            "Founded in 1918, the world's oldest organized yoga center offering classical Hatha & Householder Yoga.",
            "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80",
            true, true, "AYUSH/YCB/MUM/1918/001",
            "Govt. Recognized AYUSH & YCB Premier Yoga School",
            "YCB Teacher Training, Classical Hatha, Sattvic Diet Counseling, Stress Management"
        ));
        all.add(createLoc(
            "Kaivalyadhama Yoga Institute Mumbai",
            "YOGA", 18.9482, 72.8258,
            "Taraporevala Aquarium Campus, Netaji Subhash Road, Marine Drive, Mumbai 400002",
            4.8, 310, "+91 22 2281 8417",
            "Scientific research-backed traditional yoga school providing pranayama, therapy, and meditation.",
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
            true, true, "AYUSH/RESEARCH/1924/042",
            "Ministry of AYUSH Recognized Research Institute",
            "Scientific Yoga Therapy, Pranayama Laboratory, Panchakarma Consultation"
        ));
        all.add(createLoc(
            "Gold's Gym Bandra",
            "GYM", 19.0600, 72.8362,
            "Waterfield Road, Bandra West, Mumbai, Maharashtra 400050",
            4.6, 480, "+91 22 6699 9999",
            "Premium fitness facility with strength training, HIIT zone, and certified personal trainers.",
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
            false, false, null, null, null
        ));

        // ── 2. DELHI NCR ──
        all.add(createLoc(
            "Morarji Desai National Institute of Yoga (MDNIY)",
            "YOGA", 28.6219, 77.2144,
            "68, Ashoka Road, Near GPO, Connaught Place, New Delhi 110001",
            4.9, 820, "+91 11 2373 0417",
            "Autonomous apex institute under Ministry of AYUSH offering certified yoga therapy & education.",
            "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80",
            true, true, "AYUSH/GOV/APEX/NDL/001",
            "Ministry of AYUSH Apex National Institute",
            "YCB National Examinations, Clinical Yoga OPD, Naadi Pariksha, Diploma Programs"
        ));
        all.add(createLoc(
            "Sivananda Yoga Vedanta Centre Delhi",
            "YOGA", 28.5524, 77.2415,
            "S-75, Kailash Colony, Greater Kailash, New Delhi 110048",
            4.7, 290, "+91 11 2924 8813",
            "Classic Sivananda 5-points yoga system, vegetarian nutrition guidance, and deep meditation.",
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
            true, true, "AYUSH/YCB/NDL/2004/089",
            "YCB Accredited Sivananda Vedanta Center",
            "Sivananda Asanas, Pranic Breathing, Meditation & Vegetarian Nutrition"
        ));
        all.add(createLoc(
            "Cult.fit Connaught Place",
            "GYM", 28.6315, 77.2167,
            "Outer Circle, Block E, Connaught Place, New Delhi 110001",
            4.7, 520, "+91 1800 572 6300",
            "Group workouts, HRX training, boxing, yoga, and athletic conditioning sessions.",
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
            false, false, null, null, null
        ));

        // ── 3. RISHIKESH & HARIDWAR (YOGA CAPITAL) ──
        all.add(createLoc(
            "Parmarth Niketan Ashram Rishikesh",
            "YOGA", 30.1219, 78.3142,
            "Main Market Road, Ram Jhula, Swarg Ashram, Rishikesh, Uttarakhand 249137",
            4.9, 1850, "+91 135 243 4301",
            "World's iconic spiritual ashram along Ganga bank hosting International Yoga Festival & Ganga Aarti.",
            "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80",
            true, true, "AYUSH/YCB/RSH/1984/007",
            "Govt. Recognized Global AYUSH Ashram Center",
            "Ganga Yagyas, Classical Vedic Yoga, Pranayama, Meditation & Ayurveda"
        ));
        all.add(createLoc(
            "Patanjali Yogpeeth Haridwar",
            "WELLNESS", 29.9457, 78.1642,
            "Delhi-Haridwar National Highway, Near Bahadrabad, Haridwar, Uttarakhand 249405",
            4.9, 2400, "+91 1334 240 008",
            "India's premier Ayurvedic medical institute, Panchakarma therapy center, and Yoga research hub.",
            "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
            true, true, "AYUSH/GOV/HOSP/2006/001",
            "Govt. Accredited AYUSH Multi-Specialty Hospital & Research University",
            "Full Panchakarma, Naadi Pariksha, Ayurvedic OPD, YCB Certification, Shatkarma"
        ));

        // ── 4. BENGALURU ──
        all.add(createLoc(
            "S-VYASA Yoga University Bengaluru",
            "YOGA", 12.7844, 77.5847,
            "Prashanti Kutiram, Jigani Industrial Area, Bengaluru, Karnataka 560105",
            4.9, 980, "+91 80 2263 9968",
            "World-renowned deemed university for yoga therapy research, Cyclic Meditation, and Ayurvedic care.",
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
            true, true, "AYUSH/UNIV/BLR/2002/011",
            "Ministry of AYUSH Recognized Deemed Yoga University",
            "Cyclic Meditation, Yoga Therapy Research, Clinical OPD, YCB Degrees"
        ));
        all.add(createLoc(
            "Soukya Holistic Health Centre Bengaluru",
            "WELLNESS", 12.9866, 77.7499,
            "Samethanahalli, Whitefield, Bengaluru, Karnataka 560067",
            4.8, 340, "+91 80 2801 7000",
            "Integrative medical facility combining Ayurveda, Homeopathy, Naturopathy, and Yoga therapy.",
            "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
            true, false, "AYUSH/NABH/BLR/2010/055",
            "NABH & AYUSH Accredited Integrative Medical Facility",
            "Panchakarma, Naturopathy, Hydrotherapy, Integrative Yoga Doctor OPD"
        ));
        all.add(createLoc(
            "Cult.fit Koramangala",
            "GYM", 12.9352, 77.6245,
            "80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034",
            4.7, 710, "+91 1800 572 6300",
            "High-energy group workouts, S&C equipment, spin studio, and certified nutrition coaches.",
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
            false, false, null, null, null
        ));

        // ── 5. CHENNAI ──
        all.add(createLoc(
            "Krishnamacharya Yoga Mandiram (KYM)",
            "YOGA", 13.0382, 80.2520,
            "New No 31, 4th Cross St, RK Nagar, Raja Annamalai Puram, Chennai, Tamil Nadu 600028",
            4.9, 540, "+91 44 2493 7998",
            "Pioneering Viniyoga therapy institute established by T.K.V. Desikachar, son of T. Krishnamacharya.",
            "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80",
            true, true, "AYUSH/YCB/CHN/1976/003",
            "Govt. Recognized Viniyoga Therapy & Teacher Training Center",
            "Individualized Yoga Therapy, Viniyoga Prescriptions, Vedic Chanting"
        ));

        // ── 6. PUNE ──
        all.add(createLoc(
            "Ramamani Iyengar Memorial Yoga Institute",
            "YOGA", 18.5358, 73.8398,
            "1107 B/1, Hare Krishna Mandir Road, Shivaji Nagar, Pune, Maharashtra 411016",
            4.9, 640, "+91 20 2565 6137",
            "World-renowned institute founded by B.K.S. Iyengar, focusing on structural alignment & props.",
            "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80",
            true, true, "AYUSH/YCB/PNE/1975/001",
            "Govt. Recognized Iyengar Yoga Global Headquarters",
            "Iyengar Alignment Yoga, Therapeutic Yoga Props, Certified Teacher Evaluation"
        ));
        all.add(createLoc(
            "Govt. Ayurveda College & Hospital Pune",
            "WELLNESS", 18.5089, 73.8540,
            "Rasta Peth, Near Apollo Theatre, Pune, Maharashtra 411011",
            4.8, 410, "+91 20 2612 4235",
            "Government apex Ayurvedic hospital providing authentic Panchakarma, Swasthavritta, & Yoga OPD.",
            "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
            true, true, "AYUSH/GOV/MAH/1957/004",
            "Govt. of Maharashtra AYUSH Apex Medical Center",
            "Govt. Panchakarma OPD, Naadi Pariksha, Rasayana Therapy, Yoga OPD"
        ));
        all.add(createLoc(
            "Gold's Gym Kalyani Nagar Pune",
            "GYM", 18.5492, 73.9038,
            "3rd Floor, Mariplex Mall, Kalyani Nagar, Pune, Maharashtra 411006",
            4.5, 315, "+91 20 6620 9000",
            "State-of-the-art strength training, cardio floor, and certified fitness coaches.",
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
            false, false, null, null, null
        ));

        // ── 7. KOLKATA ──
        all.add(createLoc(
            "Ghosh Yoga College Kolkata",
            "YOGA", 22.5855, 88.3698,
            "4/2, Rammohan Roy Sarani, Amherst Street, Kolkata, West Bengal 700009",
            4.8, 280, "+91 33 2350 4910",
            "Historic physical culture and yoga institution founded by Bishnu Charan Ghosh (Bikram's guru).",
            "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80",
            true, true, "AYUSH/YCB/KOL/1923/002",
            "Govt. Recognized Bishnu Ghosh Traditional Yoga College",
            "Ghosh Yoga System, Muscle Toning Yoga, Pranayama & Asana Therapy"
        ));

        // ── 8. HYDERABAD ──
        all.add(createLoc(
            "Nizam's Institute of Naturopathy & Yoga (NINY) Hyderabad",
            "WELLNESS", 17.4325, 78.4070,
            "Begumpet Road, Punjagutta, Hyderabad, Telangana 500082",
            4.8, 450, "+91 40 2342 6000",
            "State government recognized holistic hospital combining Naturopathy, Hydrotherapy, and Clinical Yoga.",
            "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
            true, true, "AYUSH/GOV/TS/1989/012",
            "Telangana State Govt. Recognized AYUSH Center",
            "Clinical Hydrotherapy, Mud Therapy, YCB Accredited Yoga OPD, Dietetics"
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
