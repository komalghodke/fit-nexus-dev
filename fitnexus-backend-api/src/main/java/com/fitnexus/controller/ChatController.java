package com.fitnexus.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitnexus.dto.ChatRequest;
import com.fitnexus.entity.WellnessInput;
import com.fitnexus.repository.WellnessInputRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ChatController {

	@Value("${gemini.api.key}")
	private String geminiApiKey;

	@Value("${gemini.model}")
	private String geminiModel;

	@Autowired
	private WellnessInputRepository wellnessInputRepository;

	private final RestTemplate restTemplate = new RestTemplate();
	private final ObjectMapper objectMapper = new ObjectMapper();

	@PostMapping("/chat")
	public ResponseEntity<Map<String, String>> chat(@RequestBody ChatRequest request) {
		Map<String, String> response = new HashMap<>();

		if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
			response.put("reply", "Please type a message to get wellness guidance.");
			return ResponseEntity.ok(response);
		}

		// Check if Gemini API key is configured
		if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
			response.put("reply", getOfflineResponse(request.getMessage()));
			return ResponseEntity.ok(response);
		}

		try {
			// Build context from user's wellness data
			String context = buildUserContext(request.getUserId());

			// Create a wellness-focused prompt
			String systemPrompt = "You are FitNexus Wellness Companion — an AI wellness assistant specializing in yoga, "
					+ "stress management, sleep improvement, nutrition, and holistic health based on Indian wellness traditions. "
					+ "Rules: 1) ONLY answer questions related to wellness, yoga, fitness, nutrition, sleep, stress, meditation, and health. "
					+ "2) If the user asks anything unrelated (politics, coding, movies, etc.), politely say you can only help with wellness topics. "
					+ "3) Keep responses concise (2-4 sentences max). 4) Be warm and encouraging. "
					+ "5) Include actionable tips when possible. 6) Reference yoga poses, pranayama, or Ayurvedic concepts when relevant. "
					+ "7) Always add a disclaimer if the topic is medical: 'Please consult a healthcare professional for medical advice.' "
					+ "8) Do NOT use markdown formatting — respond in plain text.";

			String fullPrompt = systemPrompt + "\n\n";
			if (!context.isEmpty()) {
				fullPrompt += "User's wellness profile: " + context + "\n\n";
			}
			fullPrompt += "User's question: " + request.getMessage();

			String aiReply = callGeminiAPI(fullPrompt);
			if (aiReply != null && !aiReply.trim().isEmpty()) {
				response.put("reply", aiReply.trim());
			} else {
				response.put("reply", getOfflineResponse(request.getMessage()));
			}
		} catch (Exception e) {
			response.put("reply", getOfflineResponse(request.getMessage()));
		}

		return ResponseEntity.ok(response);
	}

	private String buildUserContext(Long userId) {
		if (userId == null) return "";
		try {
			java.util.Optional<WellnessInput> inputOpt = wellnessInputRepository.findByUserId(userId);
			if (!inputOpt.isPresent()) return "";

			WellnessInput latest = inputOpt.get();
			StringBuilder ctx = new StringBuilder();
			if (latest.getAge() != null) ctx.append("Age: ").append(latest.getAge()).append(", ");
			if (latest.getGender() != null) ctx.append("Gender: ").append(latest.getGender()).append(", ");
			if (latest.getBmi() != null) ctx.append("BMI: ").append(String.format("%.1f", latest.getBmi())).append(", ");
			if (latest.getStressLevel() != null) ctx.append("Stress: ").append(latest.getStressLevel()).append("/10, ");
			if (latest.getSleepHours() != null) ctx.append("Sleep: ").append(latest.getSleepHours()).append("hrs, ");
			if (latest.getMood() != null) ctx.append("Mood: ").append(latest.getMood()).append(", ");
			if (latest.getWorkoutType() != null) ctx.append("Workout: ").append(latest.getWorkoutType()).append(", ");
			if (latest.getYogaExperience() != null) ctx.append("Yoga level: ").append(latest.getYogaExperience()).append(", ");
			if (latest.getChronicConditions() != null && !latest.getChronicConditions().isEmpty()) {
				ctx.append("Conditions: ").append(latest.getChronicConditions()).append(", ");
			}
			if (latest.getPainArea() != null) ctx.append("Pain: ").append(latest.getPainArea()).append(", ");
			return ctx.toString();
		} catch (Exception e) {
			return "";
		}
	}

	private String callGeminiAPI(String promptText) {
		try {
			String url = "https://generativelanguage.googleapis.com/v1beta/models/"
					+ geminiModel + ":generateContent?key=" + geminiApiKey;

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);

			String jsonPayload = "{"
					+ "  \"contents\": [{"
					+ "    \"parts\": [{"
					+ "      \"text\": \"" + escapeJson(promptText) + "\""
					+ "    }]"
					+ "  }]"
					+ "}";

			HttpEntity<String> entity = new HttpEntity<>(jsonPayload, headers);
			ResponseEntity<String> resp = restTemplate.postForEntity(url, entity, String.class);

			JsonNode root = objectMapper.readTree(resp.getBody());
			return root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
		} catch (Exception e) {
			return null;
		}
	}

	private String escapeJson(String text) {
		if (text == null) return "";
		return text.replace("\\", "\\\\")
				.replace("\"", "\\\"")
				.replace("\n", "\\n")
				.replace("\r", "\\r")
				.replace("\t", "\\t");
	}

	/**
	 * Offline rule-based responses when Gemini API is not available.
	 * Provides helpful wellness tips without AI.
	 */
	private String getOfflineResponse(String message) {
		String msg = message.toLowerCase();

		if (msg.contains("stress") || msg.contains("anxious") || msg.contains("anxiety")) {
			return "For stress relief, try Nadi Shodhana (Alternate Nostril Breathing): Close your right nostril, "
					+ "inhale through the left for 4 counts, hold for 4, exhale through the right for 6 counts. "
					+ "Repeat 5-10 rounds. Also, Balasana (Child's Pose) held for 2 minutes can significantly calm the nervous system.";
		}
		if (msg.contains("sleep") || msg.contains("insomnia") || msg.contains("can't sleep")) {
			return "To improve sleep quality, practice Yoga Nidra (yogic sleep meditation) for 20 minutes before bed. "
					+ "Avoid screens 1 hour before sleeping. Try Viparita Karani (Legs Up The Wall Pose) for 5 minutes — "
					+ "it activates the parasympathetic nervous system and promotes deep relaxation.";
		}
		if (msg.contains("back pain") || msg.contains("backpain") || msg.contains("spine")) {
			return "For back pain relief, try Cat-Cow Pose (Marjaryasana-Bitilasana) — 10 slow rounds. "
					+ "Follow with Ardha Matsyendrasana (Seated Spinal Twist) held for 30 seconds each side. "
					+ "Strengthen your core with Plank Pose held for 30 seconds. Please consult a healthcare professional for persistent pain.";
		}
		if (msg.contains("weight") || msg.contains("fat") || msg.contains("slim") || msg.contains("bmi")) {
			return "For healthy weight management, combine Surya Namaskar (Sun Salutation) — 12 rounds daily burns ~150 calories — "
					+ "with a balanced diet rich in whole grains, dal, vegetables, and fruits. "
					+ "Drink warm water with lemon in the morning to boost metabolism. Avoid processed foods and eat mindfully.";
		}
		if (msg.contains("yoga") || msg.contains("asana") || msg.contains("pose")) {
			return "For beginners, start with Tadasana (Mountain Pose), Vrikshasana (Tree Pose), and Trikonasana (Triangle Pose). "
					+ "Practice 3 times/week for 30 minutes. Always warm up with gentle stretches. "
					+ "As you progress, add Surya Namaskar and Virabhadrasana (Warrior Poses) to build strength and flexibility.";
		}
		if (msg.contains("meditation") || msg.contains("calm") || msg.contains("peace") || msg.contains("mindful")) {
			return "Start with 5 minutes of Anapanasati (breath awareness meditation): sit comfortably, close your eyes, "
					+ "and simply observe your natural breath. Don't try to control it. When your mind wanders, gently return focus to the breath. "
					+ "Gradually increase to 15-20 minutes. Consistency matters more than duration.";
		}
		if (msg.contains("diet") || msg.contains("nutrition") || msg.contains("food") || msg.contains("eat")) {
			return "Follow a sattvic diet for optimal wellness: include fresh fruits, vegetables, whole grains, nuts, and legumes. "
					+ "Eat your heaviest meal at lunch when digestion is strongest (Ayurvedic principle). "
					+ "Stay hydrated with 2-3 liters of water daily. Reduce processed sugar and refined flour.";
		}
		if (msg.contains("energy") || msg.contains("tired") || msg.contains("fatigue")) {
			return "To boost energy, practice Kapalbhati Pranayama (Skull Shining Breath) for 3 minutes in the morning. "
					+ "Follow with 5 rounds of Surya Namaskar. Ensure you're getting 7-8 hours of sleep and eating iron-rich foods "
					+ "like spinach, dates, and jaggery. Stay hydrated throughout the day.";
		}
		if (msg.contains("hello") || msg.contains("hi") || msg.contains("hey") || msg.contains("namaste")) {
			return "Namaste! 🙏 I'm your FitNexus Wellness Companion. I can help you with yoga poses, stress management, "
					+ "sleep tips, nutrition advice, and meditation guidance. What wellness topic would you like to explore today?";
		}

		return "I'm here to help with wellness topics! You can ask me about: yoga poses for specific conditions, "
				+ "stress management techniques, sleep improvement tips, nutrition and diet advice, "
				+ "meditation practices, or breathing exercises (pranayama). What would you like to know?";
	}
}
