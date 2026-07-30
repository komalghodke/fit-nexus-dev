# API End-to-End Verification Script

$baseUrl = "http://localhost:8080/api"
$rand = Get-Random
$email = "verify_$rand@test.com"

# 1. Register User
$regBody = @{
    username = "VerifyUser"
    email = $email
    password = "password123"
    role = "USER"
} | ConvertTo-Json

Write-Host "--- Registering User ---"
try {
    $regRes = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $regBody -ContentType "application/json"
    Write-Host "Register Response: $regRes"
} catch {
    Write-Host "Register Error: $_"
    # If already exists, we will continue to login
}

# 2. Login User
$loginBody = @{
    email = $email
    password = "password123"
} | ConvertTo-Json

Write-Host "`n--- Logging In ---"
try {
    $loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginRes.token
    $userId = $loginRes.userId
    if (!$userId) { $userId = $loginRes.id }
    Write-Host "Login Successful. User ID: $userId, Token: [redacted]"
} catch {
    Write-Host "Login Failed: $_"
    exit
}

# 3. Submit Wellness Assessment
# We will use some test inputs to test specific YCB rules:
# - sleepHours = 5 (< 6 -> deductions and sleepTips)
# - stressLevel = 8 (> 7 -> deductions and severe stress guidelines)
# - waterIntake = 1.5 (< 2 -> deduction and hydrationTips)
# - painArea = "Neck" (-> Griva Sanchalana)
# - mood = "Anxious" (-> Root Chakra, ground energy)
# - energyLevel = "Low" (-> Surya Namaskar, Kapalabhati)
# - restingHeartRate = 105 (> 100 -> elevated heart rate)
# - hasDisease = $true (-> medical advisory)
$assessBody = @{
    fullName = "Verify User"
    email = $email
    mobileNumber = "9876543210"
    gender = "Female"
    city = "Mumbai"
    age = 30
    height = 165
    weight = 58
    waterIntake = 1.5
    digestiveIssues = "Bloating"
    painArea = "Neck"
    mood = "Anxious"
    stressLevel = 8
    sleep = "Insomnia"
    sleepQuality = "Insomnia"
    sleepHours = 5
    restingHeartRate = 105
    innerPeace = "no"
    socialSupport = "no"
    workSatisfaction = 3
    withNature = 0.5
    hasDisease = $true
    workoutType = "Yoga"
    workoutDuration = 30
    workoutFrequency = 2
    dailyCalories = 1500
    proteinIntake = 45
    fruitServings = 1
    vegetableServings = 2
    bedtime = "11:30 PM"
    wakeTime = "6:30 AM"
    stressTriggers = "Work deadlines"
    relaxationPractice = "None"
    smoking = "No"
    alcohol = "No"
    screenTime = 6
    physicalActivity = 20
    meditationMinutes = 0
    energyLevel = "Low"
    chronicConditions = "Hypertension"
    medications = "Amlodipine"
    bmi = 21.3
    yogaExperience = "Beginner"
    daysPerWeek = 1
    minutesPerSession = 20
    journalEntry = "Feeling overwhelmed by recent deadlines and having trouble calming down."
} | ConvertTo-Json

$headers = @{
    Authorization = "Bearer $token"
}

Write-Host "`n--- Submitting Wellness Form ---"
try {
    $submitRes = Invoke-RestMethod -Uri "$baseUrl/wellness/$userId" -Method Post -Body $assessBody -Headers $headers -ContentType "application/json"
    Write-Host "Submit Response: $submitRes"
} catch {
    Write-Host "Submit Failed: $_"
    exit
}

# 4. Fetch Report
Write-Host "`n--- Fetching Wellness Report ---"
try {
    $report = Invoke-RestMethod -Uri "$baseUrl/reports/$userId" -Method Get -Headers $headers
    Write-Host "Report Generated Successfully!"
    Write-Host "Score: $($report.score)/10"
    Write-Host "Status: $($report.status)"
    Write-Host "Chakra: $($report.chakra)"
    Write-Host "Mantra: $($report.mantra)"
    Write-Host "Affirmation: $($report.affirmation)"
    Write-Host "Yoga Recommendation: $($report.yogaRecommendation)"
    Write-Host "Medical Advisory: $($report.medicalAdvisory)"
    Write-Host "Mood Insight: $($report.moodInsight)"
    Write-Host "Wellness Tips:"
    foreach ($tip in $report.wellnessTips) {
        Write-Host " - $tip"
    }
    Write-Host "Sleep Tips:"
    foreach ($tip in $report.sleepTips) {
        Write-Host " - $tip"
    }
    Write-Host "Hydration Tips:"
    foreach ($tip in $report.hydrationTips) {
        Write-Host " - $tip"
    }
    Write-Host "AYUSH Recommendations:"
    foreach ($rec in $report.recommendations) {
        Write-Host " - $rec"
    }

    # Save to file to verify UTF-8 integrity
    $report | ConvertTo-Json -Depth 5 | Out-File -FilePath "C:\Users\admin\Desktop\TRIAL\fit-nexus-dev\fitnexus-frontend\src\raw_report.json" -Encoding utf8
} catch {
    Write-Host "Fetch Report Failed: $_"
}
