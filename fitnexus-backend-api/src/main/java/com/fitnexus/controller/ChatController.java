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
			System.err.println("Outer chat exception: " + e.getMessage());
			e.printStackTrace();
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
			System.err.println("Gemini API call failed: " + e.getMessage());
			e.printStackTrace();
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

		if (msg.contains("stress") || msg.contains("anxious") || msg.contains("anxiety") || msg.contains("tension") || msg.contains("overwhelm")) {
			return "For stress relief, try Nadi Shodhana (Alternate Nostril Breathing): Close your right nostril, "
					+ "inhale through the left for 4 counts, hold for 4, exhale through the right for 6 counts. "
					+ "Repeat 5-10 rounds. Also, Balasana (Child's Pose) held for 2 minutes can significantly calm the nervous system. "
					+ "Progressive Muscle Relaxation (PMR) — tensing and releasing each muscle group for 5 seconds — is another evidence-based technique.";
		}
		if (msg.contains("sleep") || msg.contains("insomnia") || msg.contains("can't sleep") || msg.contains("rest")) {
			return "To improve sleep quality, practice Yoga Nidra (yogic sleep meditation) for 20 minutes before bed. "
					+ "Avoid screens 1 hour before sleeping. Try Viparita Karani (Legs Up The Wall Pose) for 5 minutes — "
					+ "it activates the parasympathetic nervous system and promotes deep relaxation. "
					+ "Also consider Brahmi tea or warm milk with turmeric (golden milk) as a natural sleep aid.";
		}
		if (msg.contains("pranayam") || msg.contains("breathing") || msg.contains("breath")) {
			return "Pranayama (yogic breathing) is one of the most powerful wellness tools. Key techniques: "
					+ "1) Anulom Vilom — alternate nostril breathing for mental clarity, 5 minutes daily. "
					+ "2) Kapalbhati — rapid exhalations to detoxify and energize, 3 rounds of 30 pumps. "
					+ "3) Bhramari — humming bee breath to calm anxiety, 5-7 rounds. "
					+ "4) Ujjayi — ocean breath during asanas for focus and heat generation. Always practice on an empty stomach.";
		}
		if (msg.contains("back pain") || msg.contains("backpain") || msg.contains("spine") || msg.contains("lower back")) {
			return "For back pain relief, try Cat-Cow Pose (Marjaryasana-Bitilasana) — 10 slow rounds. "
					+ "Follow with Ardha Matsyendrasana (Seated Spinal Twist) held for 30 seconds each side. "
					+ "Strengthen your core with Plank Pose held for 30 seconds. Setu Bandhasana (Bridge Pose) also "
					+ "strengthens the lumbar region. Please consult a healthcare professional for persistent pain.";
		}
		if (msg.contains("headache") || msg.contains("migraine") || msg.contains("head pain")) {
			return "For headache relief, try Sheetali Pranayama (Cooling Breath): curl your tongue, inhale through it slowly, "
					+ "exhale through the nose. Repeat 10 times. Gentle neck rotations and Padahastasana (Standing Forward Bend) "
					+ "improve blood flow to the head. Applying peppermint oil on the temples also provides quick relief. "
					+ "For chronic migraines, please consult a healthcare professional.";
		}
		if (msg.contains("neck") || msg.contains("shoulder")) {
			return "For neck and shoulder tension, try gentle neck rolls (5 rotations each direction), followed by "
					+ "Garudasana (Eagle Arms) to stretch the upper back and shoulders. Gomukhasana (Cow Face Arms) "
					+ "opens the shoulder joints deeply. Hold each stretch for 30 seconds with steady breathing. "
					+ "Avoid jerky movements and never force the stretch beyond comfort.";
		}
		if (msg.contains("knee") || msg.contains("joint") || msg.contains("arthritis")) {
			return "For knee and joint health, Virabhadrasana II (Warrior 2) strengthens the muscles around the knee without strain. "
					+ "Trikonasana (Triangle Pose) improves hip and knee flexibility. Avoid deep squats or Padmasana if knees hurt. "
					+ "Warm compresses before practice and turmeric-ginger tea (anti-inflammatory) can help. "
					+ "Please consult a healthcare professional for severe joint pain.";
		}
		if (msg.contains("weight") || msg.contains("fat") || msg.contains("slim") || msg.contains("bmi") || msg.contains("lose")) {
			return "For healthy weight management, combine Surya Namaskar (Sun Salutation) — 12 rounds daily burns ~150 calories — "
					+ "with a balanced diet rich in whole grains, dal, vegetables, and fruits. "
					+ "Drink warm water with lemon in the morning to boost metabolism. Avoid processed foods and eat mindfully. "
					+ "Power Yoga and Vinyasa flows are especially effective for calorie burning.";
		}
		if (msg.contains("yoga") || msg.contains("asana") || msg.contains("pose")) {
			return "For beginners, start with Tadasana (Mountain Pose), Vrikshasana (Tree Pose), and Trikonasana (Triangle Pose). "
					+ "Practice 3 times/week for 30 minutes. Always warm up with gentle stretches. "
					+ "As you progress, add Surya Namaskar and Virabhadrasana (Warrior Poses) to build strength and flexibility. "
					+ "Remember: consistency beats intensity. Even 15 minutes daily creates lasting benefits.";
		}
		if (msg.contains("meditation") || msg.contains("calm") || msg.contains("peace") || msg.contains("mindful") || msg.contains("focus")) {
			return "Start with 5 minutes of Anapanasati (breath awareness meditation): sit comfortably, close your eyes, "
					+ "and simply observe your natural breath. Don't try to control it. When your mind wanders, gently return focus to the breath. "
					+ "Gradually increase to 15-20 minutes. Consistency matters more than duration. "
					+ "Trataka (candle gazing) is also excellent for concentration and reducing digital eye strain.";
		}
		if (msg.contains("chakra") || msg.contains("energy center") || msg.contains("spiritual")) {
			return "The 7 chakras are energy centers in the body: Root (Muladhara) — stability, Sacral (Svadhisthana) — creativity, "
					+ "Solar Plexus (Manipura) — confidence, Heart (Anahata) — love, Throat (Vishuddha) — expression, "
					+ "Third Eye (Ajna) — intuition, Crown (Sahasrara) — consciousness. "
					+ "FitNexus maps your wellness assessment to these chakras to give you a holistic view of your health journey.";
		}
		if (msg.contains("diet") || msg.contains("nutrition") || msg.contains("food") || msg.contains("eat")) {
			return "Follow a sattvic diet for optimal wellness: include fresh fruits, vegetables, whole grains, nuts, and legumes. "
					+ "Eat your heaviest meal at lunch when digestion is strongest (Ayurvedic principle). "
					+ "Stay hydrated with 2-3 liters of water daily. Reduce processed sugar and refined flour. "
					+ "Include turmeric, ginger, and ashwagandha for immunity and stress relief.";
		}
		if (msg.contains("water") || msg.contains("hydrat") || msg.contains("drink")) {
			return "Proper hydration is fundamental to wellness. Drink at least 2-3 liters of water daily. "
					+ "Start your morning with a glass of warm water with lemon to kickstart digestion. "
					+ "In Ayurveda, room-temperature or warm water is preferred over cold water as it aids digestion. "
					+ "Coconut water, buttermilk (chaas), and herbal teas are excellent hydration alternatives.";
		}
		if (msg.contains("energy") || msg.contains("tired") || msg.contains("fatigue") || msg.contains("lazy")) {
			return "To boost energy, practice Kapalbhati Pranayama (Skull Shining Breath) for 3 minutes in the morning. "
					+ "Follow with 5 rounds of Surya Namaskar. Ensure you're getting 7-8 hours of sleep and eating iron-rich foods "
					+ "like spinach, dates, and jaggery. Stay hydrated throughout the day. "
					+ "Ashwagandha supplements (consult your doctor) are known to combat chronic fatigue.";
		}
		if (msg.contains("immunity") || msg.contains("immune") || msg.contains("cold") || msg.contains("fever") || msg.contains("sick")) {
			return "To boost immunity naturally: Practice Surya Namaskar daily (improves overall circulation), "
					+ "take Chyawanprash (1 tablespoon daily — traditional Ayurvedic immunity booster), drink Kadha "
					+ "(herbal decoction with tulsi, ginger, cinnamon, black pepper, and honey), "
					+ "and practice deep breathing for 10 minutes daily to strengthen lung capacity.";
		}
		if (msg.contains("flexibility") || msg.contains("stretch") || msg.contains("stiff")) {
			return "To improve flexibility, hold each stretch for at least 30 seconds. Key poses: "
					+ "Uttanasana (Forward Fold) for hamstrings, Anjaneyasana (Low Lunge) for hip flexors, "
					+ "Supta Matsyendrasana (Supine Twist) for spinal mobility, and Paschimottanasana (Seated Forward Bend) "
					+ "for the entire posterior chain. Practice daily — flexibility improves with consistent effort, not force.";
		}
		if (msg.contains("score") || msg.contains("report") || msg.contains("wellness") || msg.contains("assessment")) {
			return "Your FitNexus Wellness Score is calculated from 27 indicators across physical, mental, spiritual, and social dimensions. "
					+ "It maps to the 7 Chakra system: higher scores indicate balanced energy centers. "
					+ "To improve your score, focus on areas marked as 'Needs Attention' in your report — typically stress, sleep, and hydration. "
					+ "Submit a new assessment anytime to track your progress over time!";
		}
		if (msg.contains("fitnexus") || msg.contains("fit nexus") || msg.contains("this app") || msg.contains("what is this")) {
			return "FitNexus is a holistic wellness ecosystem that tracks 27 health indicators across physical, mental, spiritual, "
					+ "and social dimensions. It features Predictive AI analytics (calorie burn, stress index, sleep quality), "
					+ "a GenAI Wellness Chatbot powered by Google Gemini, Chakra-based wellness mapping inspired by YCB principles, "
					+ "and a Corporate Dashboard for gyms and yoga studios. Built with React, Spring Boot, and .NET Core.";
		}
		if (msg.contains("fitness") || msg.contains("exercise") || msg.contains("workout") || msg.contains("gym")) {
			return "For a balanced fitness routine, combine: Strength training (2-3 days/week with bodyweight or weights), "
					+ "Cardio (brisk walking, cycling, or swimming 3-4 days/week for 30 minutes), "
					+ "Flexibility work (daily stretching or yoga), and Rest days (1-2 per week for recovery). "
					+ "Track your workouts in FitNexus to monitor MET-based calorie burn and progress trends!";
		}
		if (msg.contains("hello") || msg.contains("hi") || msg.contains("hey") || msg.contains("namaste")) {
			return "Namaste! 🙏 I'm your FitNexus Wellness Companion. I can help you with yoga poses, stress management, "
					+ "sleep tips, nutrition advice, pranayama techniques, chakra guidance, and meditation. "
					+ "I also understand your personal wellness data to give contextual advice. "
					+ "What wellness topic would you like to explore today?";
		}
		if (msg.contains("thank") || msg.contains("thanks") || msg.contains("bye") || msg.contains("good")) {
			return "You're welcome! 🙏 Remember: wellness is a journey, not a destination. "
					+ "Small consistent efforts create lasting change. Stay hydrated, sleep well, move your body, "
					+ "and practice gratitude daily. Come back anytime you need guidance. Namaste! 🧘";
		}

		return "Great question! While I process that, here are some wellness topics I can help with: "
				+ "🧘 Yoga poses for specific conditions (back pain, stress, flexibility), "
				+ "🫁 Pranayama techniques (Kapalbhati, Anulom Vilom, Bhramari), "
				+ "😴 Sleep improvement strategies, 🥗 Nutrition and Ayurvedic diet tips, "
				+ "🧠 Meditation and mindfulness practices, 📊 Understanding your FitNexus wellness score. "
				+ "Try asking about any of these!";
	}
}
