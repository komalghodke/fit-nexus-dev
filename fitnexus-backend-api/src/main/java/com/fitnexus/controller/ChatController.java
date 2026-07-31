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

		// Check if Gemini API key is configured and not a placeholder
		if (geminiApiKey == null || geminiApiKey.trim().isEmpty() || geminiApiKey.startsWith("${")) {
			response.put("reply", getOfflineResponse(request.getMessage()));
			return ResponseEntity.ok(response);
		}

		try {
			// Build context from user's wellness data
			String context = buildUserContext(request.getUserId());

			// Create a comprehensive wellness, health, gym & nutrition prompt
			String systemPrompt = "You are FitNexus AI Companion — an empathetic, expert AI assistant "
					+ "specializing in holistic health, yoga, gym workouts, body building, strength training, fitness, "
					+ "diet plans, food, nutrition, protein intake, weight management, Ayurveda, stress management, "
					+ "sleep improvement, body care (eyes, hair, skin, posture, digestion), mental well-being, and Indian wellness traditions. "
					+ "PERSONALITY: You are warm, caring, encouraging, and highly knowledgeable — like an expert personal coach and wellness mentor. "
					+ "SCOPE & RESPONSE RULES: "
					+ "1) ALWAYS answer questions about health, wellness, yoga, gym workouts, fitness training, exercise routines, "
					+ "diet, food recipes, nutrition, protein intake, calorie counting, weight loss, muscle gain, sleep, stress, "
					+ "meditation, body care (eyes, hair, skin, posture, gut health), mental well-being, Ayurveda, pranayama, chakras, BMI, "
					+ "immunity, women's health, and aging. "
					+ "2) For Gym & Workout questions: Provide specific exercises (squats, bench press, deadlifts, pull-ups, push-ups), "
					+ "sets, reps, muscle groups targeted, and warm-up/cool-down advice. "
					+ "3) For Diet & Food questions: Give clear meal ideas, macronutrient breakdowns (protein, carbs, healthy fats), "
					+ "sattvic and Ayurvedic food suggestions, and hydration guidance. "
					+ "4) For Yoga questions: Recommend specific asanas, pranayama techniques, duration, and benefits. "
					+ "5) If asked something completely unrelated (politics, coding, movies), gently bring it back: "
					+ "'That is an interesting topic! However, I am specialized in health, gym, diet, yoga, and wellness. How about I help you with...' "
					+ "6) Provide clear, detailed, and actionable advice (3 to 6 sentences or structured bullet points). "
					+ "7) For clinical medical conditions, kindly add: 'Please consult a healthcare professional for clinical advice.' "
					+ "8) When user wellness profile data is available, personalize your guidance based on their age, BMI, stress level, "
					+ "sleep, mood, pain areas, and chronic conditions.";

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
	 * Formatted in an interactive, warm, narrative style matching Google Gemini AI personality.
	 */
	private String getOfflineResponse(String message) {
		String msg = message.toLowerCase().trim();

		// ── CRITICAL MEDICAL EMERGENCY CHECK (Always runs first!) ──
		if (msg.contains("heart pain") || msg.contains("chest pain") || msg.contains("cardiac attack") || msg.contains("heart attack") || msg.contains("chest tightness") || msg.contains("angina") || msg.contains("stroke")) {
			return "🚨 CRITICAL HEALTH NOTICE: Chest pain or severe heart discomfort can be a sign of a serious medical emergency (such as angina or a cardiac event). "
					+ "Please seek IMMEDIATE medical assistance by calling 112 or 108, or go to the nearest emergency room right away. "
					+ "Do not engage in physical exercise, yoga, or gym workouts during acute chest pain. Please rest in a comfortable seated position until a qualified medical professional can evaluate you. Your life and safety are top priority! 🙏";
		}

		// ── Identity & Self Queries ("who are you", "what is you", "what are you", "who are u") ──
		if (msg.contains("what is you") || msg.contains("who are you") || msg.contains("what are you") || msg.contains("who are u") || msg.contains("what is fitnexus companion") || msg.contains("what is you?")) {
			return "Namaste! 🙏 I am your FitNexus AI Wellness Companion — a warm, interactive AI assistant designed to guide you through every step of your health journey. "
					+ "Inspired by ancient Indian Vedic wisdom, Maharishi Patanjali's Ashtanga Yoga, and modern predictive health science, I provide personalized guidance on yoga asanas, pranayama, gym workouts, protein & sattvic nutrition, stress management, 7 Chakra alignment, and daily care. "
					+ "How is your health feeling today? Feel free to ask me anything about your physical or mental well-being! 😊";
		}

		// ── Heart Rate, Pulse & Cardiovascular Health ──
		if (msg.contains("heart rate") || msg.contains("heartbeat") || msg.contains("pulse") || msg.contains("cardio") || msg.contains("heart") || msg.contains("blood pressure") || msg.contains("bp")) {
			return "I hear your concern about heart rate and cardiovascular health! 🫀 "
					+ "Your heart rate is a sensitive mirror of your nervous system state. To help regulate your heart rate and soothe anxiety, I strongly recommend practicing slow, conscious Anulom Vilom (Alternate Nostril Breathing) for 5–10 minutes in a comfortable seated pose. This activates the vagus nerve, lowering sympathetic nerve tension. "
					+ "For long-term cardiovascular endurance, 12 gentle rounds of Surya Namaskar combined with brisk walking work wonders. "
					+ "Are you feeling an elevated pulse or palpitation right now? If you feel any dizziness or chest tightness, please rest immediately and consult a doctor!";
		}

		// ── Blood & Blood Group Queries (handling typos like 'bllodgroup') ──
		if (msg.contains("blood") || msg.contains("bllod") || msg.contains("bloodgroup") || msg.contains("bllodgroup") || msg.contains("hemoglobin")) {
			return "Thank you for asking about blood health! 🩸 "
					+ "In holistic wellness, blood vitality (Rakta Dhatu in Ayurveda) determines your energy, oxygen distribution, and skin complexion. "
					+ "While blood group (A, B, AB, O) is genetically determined, you can boost your blood circulation and hemoglobin naturally through iron-rich foods like spinach, dates, pomegranate, beetroot, and jaggery. "
					+ "Inverted yoga poses like Sarvangasana (Shoulder Stand) and Surya Namaskar enhance arterial circulation throughout the body. "
					+ "Is there a specific blood parameter or circulation issue you'd like guidance on? I'd love to help! 😊";
		}

		// ── Sages, Rishis & Ancient Wisdom ("sages", "rishi", "muni", "guru", "tradition") ──
		if (msg.contains("sage") || msg.contains("sages") || msg.contains("rishi") || msg.contains("muni") || msg.contains("patanjali") || msg.contains("charaka") || msg.contains("sushruta") || msg.contains("guru")) {
			return "Indian Yogic and Ayurvedic science is an immortal gift handed down by ancient Sages (Rishis and Munis) who dedicated their lives to understanding human physiology and cosmic energy! 🕉️ "
					+ "Maharishi Patanjali codified the 8 Limbs of Ashtanga Yoga to still the fluctuations of the mind. Acharya Charaka and Sushruta laid the foundations of Ayurveda, teaching us how the 5 elements (Pancha Mahabhutas) and 3 Doshas (Vata, Pitta, Kapha) govern human health. "
					+ "FitNexus honours this sacred lineage by weaving traditional YCB standards into modern digital health tracking. What ancient yogic principle would you like to explore today?";
		}

		// ── Knee & Joint Pain ──
		if (msg.contains("knee") || msg.contains("joint") || msg.contains("arthritis") || msg.contains("ligament")) {
			return "I understand joint pain can make daily movement challenging, and I am here to help you protect your knees! 🌿 "
					+ "To strengthen the quadriceps and hamstring muscles that support the knee joint without causing strain, practice Virabhadrasana II (Warrior 2) and Trikonasana (Triangle Pose) with careful alignment. "
					+ "Avoid deep lotus poses (Padmasana) or extreme squatting during active flare-ups. Warm sesame oil massage and turmeric-ginger tea work as natural anti-inflammatories. "
					+ "How long have you been experiencing knee discomfort? If it is severe or swollen, please consult an orthopedic doctor!";
		}

		// ── Foot, Feet & Ankle Care ──
		if (msg.contains("foot") || msg.contains("feet") || msg.contains("ankle") || msg.contains("heel") || msg.contains("plantar") || msg.contains("toe")) {
			return "Your feet are the sacred foundation of your entire posture and grounding energy! 🦶 "
					+ "In yoga, we practice 'Pada Bandha' (the foot lock) in Tadasana (Mountain Pose) by evenly spreading all four corners of the feet to build ankle stability and spinal alignment. "
					+ "Gentle ankle rotations each morning keep the plantar fascia flexible, while an Ayurvedic warm sesame oil foot massage (Padabhyanga) before sleep draws heat down from the head, inducing deep sleep. "
					+ "Are your feet feeling fatigued or sore today? Try a warm Epsom salt foot bath for quick relief!";
		}

		// ── YCB, AYUSH & Indian Yogic Wisdom ──
		if (msg.contains("ycb") || msg.contains("ayush") || msg.contains("vedic") || msg.contains("ashtanga") || msg.contains("kosha") || msg.contains("dosha") || msg.contains("ayurveda") || msg.contains("chakras")) {
			return "FitNexus is deeply rooted in authentic Indian Yogic Wisdom aligned with Ministry of AYUSH and YCB (Yoga Certification Board) educational principles! 🕉️ "
					+ "Our framework evaluates your well-being across the Pancha Koshas (5 sheaths of existence) and Ashtanga Yoga's 8 limbs. "
					+ "We map your mood and energy states to the 7 Chakras (Root, Sacral, Solar Plexus, Heart, Throat, Third Eye, Crown) and Tridosha balance (Vata, Pitta, Kapha) — giving you a holistic reflection of your inner harmony. Would you like a breakdown of any specific Chakra?";
		}

		// ── Back & Spine Pain ──
		if (msg.contains("back pain") || msg.contains("backpain") || msg.contains("spine") || msg.contains("lower back") || msg.contains("lumbar")) {
			return "Spinal health is the key to youthful energy! 🧘 "
					+ "To relieve lower back tension and restore space between vertebrae, practice 10 slow rounds of Cat-Cow Pose (Marjaryasana-Bitilasana) coordinated with your breath. "
					+ "Follow with Bhujangasana (Cobra Pose) to strengthen lumbar muscles and Setu Bandhasana (Bridge Pose) to stabilize the pelvis. Avoid sudden forward bends during acute strain. "
					+ "Is your back pain concentrated in the lower back or upper shoulders? Let me know so I can tailor the best stretch for you!";
		}

		// ── Hair Health & Hair Fall ──
		if (msg.contains("hair") || msg.contains("hairfall") || msg.contains("hair fall") || msg.contains("scalp") || msg.contains("baldness")) {
			return "Hair health is a beautiful reflection of your internal nourishment and stress levels! 💆‍♀️ "
					+ "Inverted poses like Adho Mukha Svanasana (Downward Dog) and Sarvangasana (Shoulder Stand) direct oxygen-rich blood to scalp hair follicles. "
					+ "Practicing Kapalbhati and Anulom Vilom pranayama lowers stress hormones (cortisol) that trigger hair shedding. Massage warm Bhringraj or Amla oil into your scalp twice weekly, and eat biotin-rich nuts, seeds, and protein. "
					+ "How is your stress and sleep lately? Managing stress is often the biggest key to stopping hair fall!";
		}

		// ── Skin Health & Natural Glow ──
		if (msg.contains("skin") || msg.contains("acne") || msg.contains("pimple") || msg.contains("glow") || msg.contains("complexion")) {
			return "Radiant skin starts from within! ✨ "
					+ "Sarvangasana (Shoulder Stand) and Matsyasana (Fish Pose) enhance facial blood flow and cellular oxygenation for a natural, youthful glow. "
					+ "Practice Sheetali (Cooling Breath) to reduce internal body heat (Pitta) that causes acne breakouts. Drink warm water with lemon every morning, enjoy green tea, and try turmeric-honey face packs. "
					+ "Would you like an Ayurvedic recipe for clear skin or a pranayama technique for stress-free skin?";
		}

		// ── Digestion & Gut Health ──
		if (msg.contains("digest") || msg.contains("acidity") || msg.contains("bloat") || msg.contains("constipat") || msg.contains("gas") || msg.contains("stomach") || msg.contains("gut")) {
			return "In Ayurveda, strong digestive fire (Agni) is the secret to total vitality and immunity! 🥗 "
					+ "Sitting in Vajrasana (Thunderbolt Pose) for 5–10 minutes right after meals is the ultimate yogic secret to stimulate digestion and prevent bloating. "
					+ "Pavanamuktasana (Wind-Relieving Pose) releases trapped gas, while warm carom seed (Ajwain) water with black salt gives fast relief. "
					+ "Are you experiencing acidity or bloating right now? Try sitting in Vajrasana for 5 minutes!";
		}

		// ── Gym, Muscle, Fitness & Protein ──
		if (msg.contains("protein") || msg.contains("muscle") || msg.contains("gym") || msg.contains("fitness") || msg.contains("workout") || msg.contains("exercise") || msg.contains("squat") || msg.contains("bench")) {
			return "Building strength and lean muscle requires a harmonious balance of progressive overload, protein, and recovery! 🏋️‍♂️ "
					+ "Aim for 1.2 to 2.0 grams of protein per kg of body weight daily. Rich vegetarian sources include Paneer, Tofu, Greek Yogurt, Sprouts, Moong Dal, and Soy Chunks. "
					+ "Combine compound lifts (Squats, Bench Press, Deadlifts) with 10 minutes of post-workout yoga stretching to prevent muscle tightness. "
					+ "What is your main fitness goal right now — building muscle, losing fat, or increasing stamina?";
		}

		// ── Weight Loss & Diet ──
		if (msg.contains("weight") || msg.contains("fat") || msg.contains("slim") || msg.contains("lose") || msg.contains("calorie") || msg.contains("diet") || msg.contains("nutrition")) {
			return "Sustainable weight loss is a holistic journey of mindful eating and joyful movement! 🥑 "
					+ "Practicing 12 to 24 rounds of Surya Namaskar (Sun Salutations) daily tones your entire body while burning 150–300 calories. "
					+ "Adopt an Ayurvedic eating schedule: make lunch your largest meal when digestive Agni peaks, keep dinner light, and drink warm water throughout the day to boost metabolism. "
					+ "Would you like a sample sattvic meal plan for weight loss?";
		}

		// ── Stress & Mental Health ──
		if (msg.contains("stress") || msg.contains("anxious") || msg.contains("anxiety") || msg.contains("tension") || msg.contains("depress") || msg.contains("sad") || msg.contains("mental health")) {
			return "Your emotional well-being is deeply sacred, and taking time to calm your mind is an act of self-care. 🌿 "
					+ "Practice Bhramari Pranayama (Humming Bee Breath) for 5–7 rounds — the gentle internal vibration instantly soothes the brain's emotional center and quietens anxiety. "
					+ "Resting in Balasana (Child's Pose) or Shavasana allows your nervous system to reset. Remember that small daily acts of mindfulness bring profound inner peace. How can I support your peace of mind today?";
		}

		// ── Sleep & Insomnia ──
		if (msg.contains("sleep") || msg.contains("insomnia") || msg.contains("can't sleep") || msg.contains("rest")) {
			return "Deep, restorative sleep is when your body repairs cells and your mind consolidates memories! 🌙 "
					+ "Practice 15 minutes of guided Yoga Nidra (yogic sleep meditation) or rest with your legs up the wall (Viparita Karani) before bed to soothe your nervous system. "
					+ "Sip warm golden turmeric milk with a pinch of nutmeg, disconnect from screens 1 hour before sleeping, and keep your room dark and cool. "
					+ "How many hours of sleep did you get last night? I can help you build a night routine!";
		}

		// ── Eye Care ──
		if (msg.contains("eye") || msg.contains("vision") || msg.contains("eyesight") || msg.contains("spectacle") || msg.contains("screen strain")) {
			return "Protecting your eyes from modern digital fatigue is vital for long-term clarity! 👁️ "
					+ "Practice Trataka (candle gazing) or gentle eye rotations to strengthen ocular muscles, and use 'Palming' (rubbing warm palms over closed eyes) for instant relief from screen strain. "
					+ "Follow the 20-20-20 rule and include Vitamin A rich foods like carrots, spinach, and amla in your daily diet.";
		}

		// ── Greetings ──
		if (msg.contains("hello") || msg.contains("hi") || msg.contains("hey") || msg.contains("namaste") || msg.contains("good morning")) {
			return "Namaste! 🙏 I am your FitNexus Wellness Companion. I am here to guide you on your journey through yoga asanas, pranayama, gym workouts, sattvic nutrition, stress management, 7 Chakra alignment, and overall well-being. "
					+ "What aspect of your health would you like to explore or nourish today? 😊";
		}

		// ── Smart Conversational Interactive Fallback (Engages like Gemini AI!) ──
		return "Namaste! 🙏 Thank you for chatting with your FitNexus Wellness Companion! "
				+ "I am listening closely to your query. Every aspect of your well-being — whether it's your physical body, mental calm, heart rate, nutrition, or daily routine — is connected in your health journey. "
				+ "As an interactive wellness guide drawing from authentic Indian Yogic traditions (YCB), Ayurveda, gym fitness, and modern health science, I can assist you with: "
				+ "• Yoga Poses & Pain Relief (back, knees, shoulders, feet) "
				+ "• Heart Rate & Breathing (pranayama for calm & circulation) "
				+ "• Gym & Nutrition (protein plans, workouts, fat loss) "
				+ "• Daily Care & Wellness Reports (hair, skin, sleep, chakras). "
				+ "Could you tell me a bit more about what you'd like to focus on today? I am right here with you! 🌿✨";
	}
}


