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
			String systemPrompt = "You are FitNexus Wellness Companion — an empathetic, knowledgeable AI wellness assistant "
					+ "specializing in holistic health, yoga, Ayurveda, stress management, sleep improvement, nutrition, "
					+ "fitness, body care (eyes, hair, skin, posture), mental well-being, and Indian wellness traditions. "
					+ "PERSONALITY: You are warm, caring, conversational, and encouraging — like a knowledgeable wellness friend. "
					+ "Use a friendly, chat-like tone. Start responses with empathy or acknowledgment of the user's concern. "
					+ "SCOPE RULES: "
					+ "1) Answer questions about wellness, yoga, fitness, nutrition, sleep, stress, meditation, health, body care "
					+ "(eyes, hair, skin, nails, posture, digestion), mental health, Ayurveda, pranayama, chakras, BMI, weight, "
					+ "hydration, immunity, women's health, aging, and general well-being. "
					+ "2) For topics like BMI, explain what it is, how it's calculated (weight/height^2), what ranges mean, and give actionable advice. "
					+ "3) For body-related queries (eyes, hair, skin), provide yoga poses, nutrition tips, and Ayurvedic remedies that help. "
					+ "4) If the user asks something completely unrelated (politics, coding, movies, etc.), gently redirect: "
					+ "'That's an interesting topic! However, I specialize in wellness and health. How about I help you with...' "
					+ "5) Give detailed, helpful responses — aim for 3-6 sentences with actionable advice. Don't be too brief. "
					+ "6) Include specific yoga poses, pranayama techniques, or Ayurvedic remedies when relevant. "
					+ "7) For medical topics, always add: 'Please consult a healthcare professional for personalized medical advice.' "
					+ "8) Do NOT use markdown formatting (no *, #, -, etc.) — respond in clean plain text. "
					+ "9) When the user's wellness profile data is available, personalize your advice based on their BMI, stress level, "
					+ "sleep hours, mood, pain areas, and chronic conditions.";

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

		// ── Greetings ──
		if (msg.contains("hello") || msg.contains("hi") || msg.contains("hey") || msg.contains("namaste") || msg.contains("good morning") || msg.contains("good evening")) {
			return "Namaste! 🙏 I'm your FitNexus Wellness Companion. I'm here to chat about anything wellness-related — "
					+ "yoga poses, stress relief, sleep tips, nutrition advice, hair care, eye health, skin glow, mental well-being, "
					+ "pranayama techniques, chakra guidance, BMI insights, and so much more. "
					+ "I also understand your personal wellness data to give you advice tailored just for you. "
					+ "What's on your mind today? Feel free to ask me anything! 😊";
		}

		// ── BMI ──
		if (msg.contains("bmi") || msg.contains("body mass index")) {
			return "BMI (Body Mass Index) is a simple measure to assess whether you're at a healthy weight for your height. "
					+ "It's calculated as: BMI = Weight (kg) / Height (m)². "
					+ "Here's what the ranges mean: Below 18.5 = Underweight, 18.5–24.9 = Normal (healthy), 25–29.9 = Overweight, 30+ = Obese. "
					+ "For example, if you weigh 70 kg and are 1.70 m tall, your BMI would be 70 / (1.70 × 1.70) = 24.2 (Normal). "
					+ "To maintain a healthy BMI, combine Surya Namaskar (12 rounds daily), a balanced sattvic diet, and 30 minutes of daily physical activity. "
					+ "Remember, BMI doesn't account for muscle mass, so athletes may show higher values. Consult a healthcare professional for a complete assessment.";
		}

		// ── Eyes ──
		if (msg.contains("eye") || msg.contains("vision") || msg.contains("eyesight") || msg.contains("spectacle") || msg.contains("dark circle")) {
			return "Great question about eye health! Your eyes need care just like any other part of your body. "
					+ "Try Trataka (candle gazing meditation) — stare at a steady candle flame for 2-3 minutes without blinking, then close your eyes and visualize the flame. This strengthens eye muscles and improves focus. "
					+ "Palming is another wonderful technique: rub your palms together until warm, then gently cup them over your closed eyes for 1-2 minutes. "
					+ "For dark circles, ensure 7-8 hours of sleep, reduce screen time, and apply cold cucumber slices or rose water. "
					+ "Nutrition tips: eat carrots, spinach, sweet potatoes (rich in Vitamin A), and amla (Indian gooseberry) for eye health. "
					+ "Follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds to reduce digital eye strain.";
		}

		// ── Hair ──
		if (msg.contains("hair") || msg.contains("hairfall") || msg.contains("hair fall") || msg.contains("baldness") || msg.contains("dandruff") || msg.contains("scalp")) {
			return "Hair health is deeply connected to your overall wellness! Here's what can help: "
					+ "Yoga: Adho Mukha Svanasana (Downward Dog), Uttanasana (Forward Bend), and Sarvangasana (Shoulder Stand) improve blood circulation to the scalp. "
					+ "Pranayama: Kapalbhati and Anulom Vilom reduce stress — one of the biggest causes of hair fall. "
					+ "Ayurvedic remedies: Massage warm coconut or bhringraj oil into your scalp twice a week. Amla (Indian gooseberry) is a powerful hair tonic — eat it or apply amla oil. "
					+ "Nutrition: Include biotin-rich foods (eggs, nuts, seeds), iron (spinach, dates, jaggery), and protein (dal, paneer) in your diet. "
					+ "Avoid excessive heat styling, harsh chemicals, and wash with lukewarm (not hot) water. "
					+ "If hair fall is persistent, please consult a dermatologist for personalized advice.";
		}

		// ── Skin ──
		if (msg.contains("skin") || msg.contains("acne") || msg.contains("pimple") || msg.contains("glow") || msg.contains("complexion") || msg.contains("wrinkle")) {
			return "Beautiful skin starts from within! Here's a holistic approach: "
					+ "Yoga: Sarvangasana (Shoulder Stand) and Halasana (Plough Pose) boost blood flow to the face, giving a natural glow. "
					+ "Matsyasana (Fish Pose) is known as 'the destroyer of all diseases' and improves skin texture. "
					+ "Pranayama: Sheetali (Cooling Breath) and Bhramari reduce stress hormones that cause acne and breakouts. "
					+ "Ayurvedic tips: Apply a turmeric + honey + curd face pack weekly. Drink warm water with lemon and turmeric every morning. "
					+ "Eat antioxidant-rich foods: berries, tomatoes, green tea, and almonds. Stay hydrated with 2-3 liters of water daily. "
					+ "Avoid excessive sugar and processed foods — they trigger inflammation and acne. Get 7-8 hours of quality sleep for skin repair.";
		}

		// ── Digestion ──
		if (msg.contains("digest") || msg.contains("acidity") || msg.contains("bloat") || msg.contains("constipat") || msg.contains("gas") || msg.contains("stomach") || msg.contains("gut")) {
			return "Digestive health is the foundation of overall wellness in Ayurveda! Here's what can help: "
					+ "Yoga: Pavanamuktasana (Wind-Relieving Pose) is excellent for gas and bloating. Vajrasana (Thunderbolt Pose) after meals aids digestion — "
					+ "it's the ONLY yoga pose recommended immediately after eating! Ardha Matsyendrasana (Spinal Twist) massages digestive organs. "
					+ "Pranayama: Kapalbhati on an empty stomach detoxifies and stimulates the digestive fire (Agni). "
					+ "Ayurvedic tips: Drink warm water throughout the day, chew food thoroughly, eat your heaviest meal at lunch. "
					+ "Triphala powder (1 tsp with warm water before bed) is a powerful Ayurvedic digestive tonic. Ajwain (carom seeds) with black salt gives instant relief from bloating. "
					+ "If digestive issues persist, please consult a gastroenterologist.";
		}

		// ── Mental Health ──
		if (msg.contains("depress") || msg.contains("sad") || msg.contains("lonely") || msg.contains("mental health") || msg.contains("emotional") || msg.contains("cry") || msg.contains("hopeless")) {
			return "I hear you, and I want you to know that your feelings are valid. Mental well-being is just as important as physical health. 💙 "
					+ "Yoga: Balasana (Child's Pose) and Shavasana (Corpse Pose) help calm the nervous system. "
					+ "Bhujangasana (Cobra Pose) gently opens the chest and is known to help with mood regulation. "
					+ "Pranayama: Bhramari (Humming Bee Breath) — the vibration has a soothing effect on the brain. Practice 5-7 rounds with eyes closed. "
					+ "Anulom Vilom for 5 minutes daily balances both hemispheres of the brain and reduces anxiety. "
					+ "Also try gratitude journaling: write 3 things you're grateful for each morning. Spending time in nature, even 15 minutes, can significantly lift your mood. "
					+ "Please remember: if you're struggling, it's completely okay to seek help from a mental health professional. You don't have to do this alone. 🙏";
		}

		// ── Posture ──
		if (msg.contains("posture") || msg.contains("hunch") || msg.contains("sitting") || msg.contains("desk") || msg.contains("ergonomic")) {
			return "Good posture is key to preventing back pain, neck strain, and even headaches! "
					+ "Yoga: Tadasana (Mountain Pose) is the foundational pose for correct postural alignment — practice standing tall with awareness throughout the day. "
					+ "Bhujangasana (Cobra Pose) and Setu Bandhasana (Bridge Pose) strengthen the spine and counteract the effects of prolonged sitting. "
					+ "Do gentle neck rolls and shoulder shrugs every hour if you work at a desk. "
					+ "Keep your screen at eye level, feet flat on the floor, and shoulders relaxed. Take a 2-minute standing break every 30 minutes. "
					+ "Cat-Cow Pose (Marjaryasana-Bitilasana) is perfect for a mid-day spinal reset — do 10 slow rounds.";
		}

		// ── Women's Health ──
		if (msg.contains("period") || msg.contains("menstrua") || msg.contains("pcos") || msg.contains("pcod") || msg.contains("cramp") || msg.contains("pregnan")) {
			return "Women's wellness is an important part of holistic health! "
					+ "For menstrual cramps: Supta Baddha Konasana (Reclining Butterfly) and Balasana (Child's Pose) gently ease pain. "
					+ "Warm ginger-jaggery tea is an excellent natural remedy for menstrual discomfort. "
					+ "For PCOS/PCOD: Butterfly Pose (Baddha Konasana), Surya Namaskar, and Kapalbhati are helpful in managing hormonal balance. "
					+ "A low-sugar, anti-inflammatory diet with whole grains, leafy greens, and flaxseeds is recommended. "
					+ "During pregnancy, gentle prenatal yoga (Cat-Cow, Tadasana, Malasana) under guided supervision is beneficial. "
					+ "Avoid inversions and deep twists during menstruation. Always consult a healthcare professional for personalized gynecological advice.";
		}

		// ── Aging ──
		if (msg.contains("aging") || msg.contains("old age") || msg.contains("senior") || msg.contains("elderly") || msg.contains("anti-aging") || msg.contains("age")) {
			return "Aging gracefully is about maintaining vitality in body, mind, and spirit! "
					+ "Yoga: Gentle Hatha yoga, Vrikshasana (Tree Pose for balance), and Tadasana (Mountain Pose for posture) are excellent for seniors. "
					+ "Pranayama: Anulom Vilom and Bhramari keep the mind sharp and reduce anxiety. "
					+ "Ayurvedic tips: Ashwagandha is known as a rejuvenating herb — it helps with energy, sleep, and cognitive function. "
					+ "Triphala supports digestion, and Chyawanprash boosts immunity. "
					+ "Stay socially active, learn new skills, and maintain a regular sleep schedule. "
					+ "Bone health: include calcium-rich foods (milk, ragi, sesame seeds) and Vitamin D (sunlight, fortified foods). "
					+ "Regular gentle movement is more important than intensity — consistency is the key to longevity.";
		}

		// ── Stress ──
		if (msg.contains("stress") || msg.contains("anxious") || msg.contains("anxiety") || msg.contains("tension") || msg.contains("overwhelm") || msg.contains("panic") || msg.contains("worry")) {
			return "I understand stress can feel overwhelming, and I'm glad you're reaching out. 🌿 "
					+ "Try Nadi Shodhana (Alternate Nostril Breathing): Close your right nostril, inhale through the left for 4 counts, "
					+ "hold for 4, exhale through the right for 6 counts. Repeat 5-10 rounds. "
					+ "Balasana (Child's Pose) held for 2 minutes can significantly calm the nervous system. "
					+ "Progressive Muscle Relaxation (PMR) — tensing and releasing each muscle group for 5 seconds — is another evidence-based technique. "
					+ "Limit caffeine, practice digital detox for 30 minutes daily, and consider journaling your thoughts before bed.";
		}
		if (msg.contains("sleep") || msg.contains("insomnia") || msg.contains("can't sleep") || msg.contains("rest") || msg.contains("nap")) {
			return "Quality sleep is absolutely essential for your body's healing and mental clarity! "
					+ "Practice Yoga Nidra (yogic sleep meditation) for 20 minutes before bed — it's like giving your brain a complete reset. "
					+ "Avoid screens 1 hour before sleeping. Try Viparita Karani (Legs Up The Wall Pose) for 5 minutes — "
					+ "it activates the parasympathetic nervous system and promotes deep relaxation. "
					+ "Brahmi tea or warm milk with turmeric and a pinch of nutmeg (golden milk) is a wonderful natural sleep aid. "
					+ "Keep your bedroom cool, dark, and quiet. Try to sleep and wake at the same time daily — your body loves rhythm.";
		}
		if (msg.contains("pranayam") || msg.contains("breathing") || msg.contains("breath")) {
			return "Pranayama (yogic breathing) is one of the most powerful wellness tools you can practice! "
					+ "Key techniques: 1) Anulom Vilom — alternate nostril breathing for mental clarity, 5 minutes daily. "
					+ "2) Kapalbhati — rapid exhalations to detoxify and energize, 3 rounds of 30 pumps. "
					+ "3) Bhramari — humming bee breath to calm anxiety, 5-7 rounds. "
					+ "4) Ujjayi — ocean breath during asanas for focus and heat generation. "
					+ "5) Sheetali — cooling breath for reducing body heat and anger. "
					+ "Always practice on an empty stomach, preferably in the morning. Start with 5 minutes and gradually increase.";
		}
		if (msg.contains("back pain") || msg.contains("backpain") || msg.contains("spine") || msg.contains("lower back")) {
			return "Back pain is one of the most common concerns, and yoga can really help! "
					+ "Try Cat-Cow Pose (Marjaryasana-Bitilasana) — 10 slow rounds to warm up the spine. "
					+ "Follow with Ardha Matsyendrasana (Seated Spinal Twist) held for 30 seconds each side. "
					+ "Strengthen your core with Plank Pose held for 30 seconds. Setu Bandhasana (Bridge Pose) also "
					+ "strengthens the lumbar region. Avoid forward bending if you have acute pain. "
					+ "Apply warm compresses and maintain good sitting posture throughout the day. "
					+ "Please consult a healthcare professional for persistent or severe pain.";
		}
		if (msg.contains("headache") || msg.contains("migraine") || msg.contains("head pain")) {
			return "Headaches can really affect your day — let me share some natural relief techniques! "
					+ "Try Sheetali Pranayama (Cooling Breath): curl your tongue, inhale through it slowly, exhale through the nose. Repeat 10 times. "
					+ "Gentle neck rotations and Padahastasana (Standing Forward Bend) improve blood flow to the head. "
					+ "Applying peppermint oil on the temples also provides quick relief. "
					+ "Stay hydrated — dehydration is one of the most common headache triggers! "
					+ "For chronic migraines, please consult a healthcare professional.";
		}
		if (msg.contains("neck") || msg.contains("shoulder")) {
			return "Neck and shoulder tension is very common, especially with desk work and screen time! "
					+ "Try gentle neck rolls (5 rotations each direction), followed by "
					+ "Garudasana (Eagle Arms) to stretch the upper back and shoulders. Gomukhasana (Cow Face Arms) "
					+ "opens the shoulder joints deeply. Hold each stretch for 30 seconds with steady breathing. "
					+ "Shrug your shoulders up to your ears, hold for 5 seconds, then release — repeat 5 times. "
					+ "Avoid jerky movements and never force the stretch beyond comfort.";
		}
		if (msg.contains("knee") || msg.contains("joint") || msg.contains("arthritis")) {
			return "Joint health is crucial for maintaining an active lifestyle! "
					+ "Virabhadrasana II (Warrior 2) strengthens the muscles around the knee without strain. "
					+ "Trikonasana (Triangle Pose) improves hip and knee flexibility. Avoid deep squats or Padmasana if knees hurt. "
					+ "Warm compresses before practice and turmeric-ginger tea (anti-inflammatory) can help. "
					+ "Gentle swimming and cycling are also excellent low-impact exercises for joint health. "
					+ "Please consult a healthcare professional for severe joint pain.";
		}
		if (msg.contains("weight") || msg.contains("fat") || msg.contains("slim") || msg.contains("lose") || msg.contains("obesity") || msg.contains("calorie")) {
			return "Healthy weight management is about balance, not extreme dieting! "
					+ "Combine Surya Namaskar (Sun Salutation) — 12 rounds daily burns ~150 calories — "
					+ "with a balanced diet rich in whole grains, dal, vegetables, and fruits. "
					+ "Drink warm water with lemon in the morning to boost metabolism. Avoid processed foods and eat mindfully. "
					+ "Power Yoga and Vinyasa flows are especially effective for calorie burning. "
					+ "Practice portion control: use smaller plates and eat slowly. Kapalbhati pranayama also helps stimulate metabolism. "
					+ "Remember — sustainable weight loss is about lifestyle change, not quick fixes!";
		}
		if (msg.contains("yoga") || msg.contains("asana") || msg.contains("pose")) {
			return "Yoga is a beautiful journey of self-discovery! "
					+ "For beginners, start with Tadasana (Mountain Pose), Vrikshasana (Tree Pose), and Trikonasana (Triangle Pose). "
					+ "Practice 3 times/week for 30 minutes. Always warm up with gentle stretches. "
					+ "As you progress, add Surya Namaskar and Virabhadrasana (Warrior Poses) to build strength and flexibility. "
					+ "Remember: consistency beats intensity. Even 15 minutes daily creates lasting benefits. "
					+ "Listen to your body — yoga should feel challenging but never painful. 🧘";
		}
		if (msg.contains("meditation") || msg.contains("calm") || msg.contains("peace") || msg.contains("mindful") || msg.contains("focus") || msg.contains("concentrat")) {
			return "Meditation is one of the most transformative practices for mental clarity and inner peace! "
					+ "Start with 5 minutes of Anapanasati (breath awareness): sit comfortably, close your eyes, "
					+ "and simply observe your natural breath. Don't try to control it. "
					+ "When your mind wanders (and it will — that's normal!), gently return focus to the breath. "
					+ "Gradually increase to 15-20 minutes. Try guided meditations or Yoga Nidra if silent meditation feels difficult. "
					+ "Trataka (candle gazing) is excellent for concentration and reducing digital eye strain. "
					+ "Consistency matters more than duration — a daily 5-minute practice beats an occasional 1-hour session.";
		}
		if (msg.contains("chakra") || msg.contains("energy center") || msg.contains("spiritual")) {
			return "The 7 chakras are energy centers along your spine, each governing different aspects of your well-being! "
					+ "Root (Muladhara) — stability and safety. Sacral (Svadhisthana) — creativity and emotions. "
					+ "Solar Plexus (Manipura) — confidence and personal power. Heart (Anahata) — love and compassion. "
					+ "Throat (Vishuddha) — expression and truth. Third Eye (Ajna) — intuition and clarity. "
					+ "Crown (Sahasrara) — consciousness and spiritual connection. "
					+ "FitNexus maps your wellness assessment to these chakras to give you a holistic view of your health journey. "
					+ "Balancing chakras involves specific yoga poses, pranayama, mantras, and meditation for each energy center.";
		}
		if (msg.contains("diet") || msg.contains("nutrition") || msg.contains("food") || msg.contains("eat") || msg.contains("meal")) {
			return "Good nutrition is the foundation of wellness! Follow a sattvic diet for optimal health: "
					+ "Include fresh fruits, vegetables, whole grains, nuts, and legumes. "
					+ "Eat your heaviest meal at lunch when digestion is strongest (Ayurvedic principle). "
					+ "Stay hydrated with 2-3 liters of water daily. Reduce processed sugar and refined flour (maida). "
					+ "Include turmeric, ginger, and ashwagandha for immunity and stress relief. "
					+ "Practice mindful eating: eat without screens, chew each bite 20-30 times, and stop when 80% full. "
					+ "A colorful plate is a nutritious plate — aim for variety in every meal! 🥗";
		}
		if (msg.contains("water") || msg.contains("hydrat") || msg.contains("drink") || msg.contains("thirst")) {
			return "Proper hydration is fundamental to every body function! "
					+ "Drink at least 2-3 liters of water daily. Start your morning with a glass of warm water with lemon. "
					+ "In Ayurveda, room-temperature or warm water is preferred over cold water as it aids digestion. "
					+ "Coconut water, buttermilk (chaas), and herbal teas are excellent hydration alternatives. "
					+ "Signs of dehydration: dark urine, headache, fatigue, dry skin, and dizziness. "
					+ "Pro tip: keep a water bottle at your desk and set hourly reminders to sip!";
		}
		if (msg.contains("energy") || msg.contains("tired") || msg.contains("fatigue") || msg.contains("lazy") || msg.contains("lethargi") || msg.contains("exhaust")) {
			return "Feeling low on energy? Let's fix that naturally! "
					+ "Practice Kapalbhati Pranayama (Skull Shining Breath) for 3 minutes in the morning — it's an instant energizer. "
					+ "Follow with 5 rounds of Surya Namaskar to wake up every cell in your body. "
					+ "Ensure you're getting 7-8 hours of quality sleep and eating iron-rich foods like spinach, dates, and jaggery. "
					+ "Stay hydrated throughout the day — dehydration is a sneaky energy thief! "
					+ "Limit caffeine after 2 PM, and try a 10-minute power nap (not longer) if you feel an afternoon slump. "
					+ "Ashwagandha supplements (consult your doctor) are known to combat chronic fatigue.";
		}
		if (msg.contains("immunity") || msg.contains("immune") || msg.contains("cold") || msg.contains("fever") || msg.contains("sick") || msg.contains("cough") || msg.contains("flu")) {
			return "Let's boost your natural defenses! "
					+ "Practice Surya Namaskar daily — it improves overall circulation and immune function. "
					+ "Take Chyawanprash (1 tablespoon daily) — a traditional Ayurvedic immunity booster packed with Vitamin C. "
					+ "Drink Kadha (herbal decoction with tulsi, ginger, cinnamon, black pepper, and honey) — especially helpful during seasonal changes. "
					+ "Practice deep breathing for 10 minutes daily to strengthen lung capacity. "
					+ "Eat probiotic foods like yogurt (curd) for gut health, which directly impacts immunity. "
					+ "Get adequate Vitamin D through morning sunlight (15-20 minutes before 10 AM).";
		}
		if (msg.contains("flexibility") || msg.contains("stretch") || msg.contains("stiff") || msg.contains("tight")) {
			return "Flexibility is something that improves with patience and consistency! "
					+ "Hold each stretch for at least 30 seconds — this is where the magic happens. "
					+ "Key poses: Uttanasana (Forward Fold) for hamstrings, Anjaneyasana (Low Lunge) for hip flexors, "
					+ "Supta Matsyendrasana (Supine Twist) for spinal mobility, and Paschimottanasana (Seated Forward Bend) "
					+ "for the entire posterior chain. Butterfly Pose (Baddha Konasana) opens the hips beautifully. "
					+ "Practice daily — flexibility improves with consistent effort, not force. Never bounce in a stretch!";
		}
		if (msg.contains("score") || msg.contains("report") || msg.contains("wellness") || msg.contains("assessment")) {
			return "Your FitNexus Wellness Score is a comprehensive measure calculated from 27 indicators across physical, mental, spiritual, and social dimensions. "
					+ "It maps to the 7 Chakra system: higher scores indicate balanced energy centers. "
					+ "The score considers factors like BMI, sleep quality, stress levels, hydration, exercise frequency, meditation practice, and more. "
					+ "To improve your score, focus on areas marked as 'Needs Attention' in your report — typically stress management, sleep hygiene, and hydration. "
					+ "Submit a new assessment anytime to track your progress over time! Your wellness journey is unique to you. 🌿";
		}
		if (msg.contains("fitnexus") || msg.contains("fit nexus") || msg.contains("this app") || msg.contains("what is this") || msg.contains("about")) {
			return "FitNexus is a holistic wellness ecosystem designed to support your complete health journey! "
					+ "It tracks 27 health indicators across physical, mental, spiritual, and social dimensions. "
					+ "Key features: Predictive AI analytics (calorie burn, stress index, sleep quality), "
					+ "a GenAI Wellness Chatbot powered by Google Gemini (that's me! 😊), "
					+ "Chakra-based wellness mapping inspired by YCB (Yoga Certification Board) principles, "
					+ "personalized yoga and pranayama recommendations, and a Corporate Dashboard for gyms and yoga studios. "
					+ "Built with React, Spring Boot, .NET Core, and Google Gemini AI.";
		}
		if (msg.contains("fitness") || msg.contains("exercise") || msg.contains("workout") || msg.contains("gym") || msg.contains("cardio") || msg.contains("strength")) {
			return "A well-rounded fitness routine covers all bases! Here's the ideal mix: "
					+ "Strength training (2-3 days/week with bodyweight or weights), "
					+ "Cardio (brisk walking, cycling, or swimming 3-4 days/week for 30 minutes), "
					+ "Flexibility work (daily stretching or yoga), and Rest days (1-2 per week for recovery). "
					+ "Warm up for 5 minutes before exercise and cool down with stretches afterward. "
					+ "Track your workouts in FitNexus to monitor MET-based calorie burn and progress trends! 💪";
		}
		if (msg.contains("thank") || msg.contains("thanks") || msg.contains("bye") || msg.contains("good")) {
			return "You're welcome! 🙏 Remember: wellness is a journey, not a destination. "
					+ "Small consistent efforts create lasting change. Stay hydrated, sleep well, move your body, "
					+ "and practice gratitude daily. Every step you take towards better health matters. "
					+ "Come back anytime you need guidance or just want to chat about wellness. Namaste! 🧘✨";
		}

		// ── Default: attempt a helpful general response ──
		return "That's a thoughtful question! While I'd love to give you a detailed answer, let me share what I know best as your wellness companion. "
				+ "I can help you with: yoga poses and sequences for any condition, pranayama breathing techniques, "
				+ "Ayurvedic remedies and nutrition advice, eye/hair/skin care through yoga and diet, "
				+ "stress and anxiety management, sleep improvement strategies, BMI and weight guidance, "
				+ "meditation and mindfulness practices, chakra balancing, and understanding your FitNexus wellness report. "
				+ "Try asking me something specific like 'How can I improve my sleep?' or 'What yoga helps with hair fall?' — "
				+ "I'd love to help! 😊";
	}
}
