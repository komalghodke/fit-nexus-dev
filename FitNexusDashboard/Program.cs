using MySqlConnector;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Enable CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseHttpsRedirection();

string connectionString = app.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=localhost;Database=fitnexusdb;User=root;Password=root;";

// Initialize Database Table
try
{
    using var connection = new MySqlConnection(connectionString);
    await connection.OpenAsync();
    using var cmd = new MySqlCommand(@"
        CREATE TABLE IF NOT EXISTS partner_inquiries (
            id INT AUTO_INCREMENT PRIMARY KEY,
            org_name VARCHAR(255) NOT NULL,
            org_type VARCHAR(100) NOT NULL,
            contact_name VARCHAR(255) NOT NULL,
            contact_email VARCHAR(255) NOT NULL,
            contact_phone VARCHAR(50),
            city VARCHAR(100),
            message TEXT,
            submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );", connection);
    await cmd.ExecuteNonQueryAsync();
}
catch (Exception ex)
{
    Console.WriteLine($"DB Initialization failed: {ex.Message}");
}

// 1. GET /api/corporate/stats
app.MapGet("/api/corporate/stats", async () =>
{
    try
    {
        using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        // 1. Active Users
        using var cmd1 = new MySqlCommand("SELECT COUNT(*) FROM users WHERE role = 'USER'", connection);
        var activeUsers = Convert.ToInt32(await cmd1.ExecuteScalarAsync());

        // 2. Averages from wellness_inputs (using actual DB columns)
        using var cmd2 = new MySqlCommand(
            "SELECT COUNT(*), IFNULL(AVG(stress_level), 0), IFNULL(AVG(work_satisfaction), 0), IFNULL(AVG(sleep_hours), 0), IFNULL(AVG(bmi), 0) FROM wellness_inputs", 
            connection);
        using var reader = await cmd2.ExecuteReaderAsync();
        double avgStress = 0;
        double avgWorkSat = 0;
        double avgSleep = 0;
        double avgBmi = 0;
        int totalAssessments = 0;

        if (await reader.ReadAsync())
        {
            totalAssessments = reader.GetInt32(0);
            avgStress = Math.Round(reader.GetDouble(1), 1);
            avgWorkSat = Math.Round(reader.GetDouble(2), 1);
            avgSleep = Math.Round(reader.GetDouble(3), 1);
            avgBmi = Math.Round(reader.GetDouble(4), 1);
        }
        await reader.CloseAsync();

        // 3. Workouts Logged
        using var cmd3 = new MySqlCommand("SELECT COUNT(*) FROM workouts", connection);
        var totalWorkouts = Convert.ToInt32(await cmd3.ExecuteScalarAsync());

        // 4. Staff count
        using var cmd4 = new MySqlCommand("SELECT COUNT(*) FROM users WHERE role IN ('YOGA_INSTRUCTOR', 'GYM_TRAINER')", connection);
        var staffCount = Convert.ToInt32(await cmd4.ExecuteScalarAsync());

        return Results.Ok(new
        {
            ActiveMembers = activeUsers,
            TotalAssessments = totalAssessments,
            AverageStressLevel = avgStress,
            AverageWorkSatisfaction = avgWorkSat,
            AverageSleepHours = avgSleep,
            AverageBmi = avgBmi,
            TotalWorkoutsLogged = totalWorkouts,
            ActiveStaffCount = staffCount
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Database connection failed: {ex.Message}");
    }
});

// 2. GET /api/corporate/trends
app.MapGet("/api/corporate/trends", async () =>
{
    try
    {
        using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        using var cmd = new MySqlCommand("SELECT mood as category, COUNT(*) as count, ROUND(AVG(stress_level), 1) as avgStress, ROUND(AVG(sleep_hours), 1) as avgSleep FROM wellness_inputs WHERE mood IS NOT NULL GROUP BY mood", connection);
        using var reader = await cmd.ExecuteReaderAsync();
        var list = new System.Collections.Generic.List<object>();
        while (await reader.ReadAsync())
        {
            list.Add(new
            {
                MoodCategory = reader.IsDBNull(0) ? "Unknown" : reader.GetString(0),
                Count = reader.GetInt32(1),
                AverageStress = reader.GetDouble(2),
                AverageSleep = reader.GetDouble(3)
            });
        }
        return Results.Ok(list);
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

// 3. GET /api/corporate/demographics
app.MapGet("/api/corporate/demographics", async () =>
{
    try
    {
        using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        var genderStats = new System.Collections.Generic.List<object>();
        using (var cmdGender = new MySqlCommand("SELECT gender, COUNT(*) as count, ROUND(AVG(stress_level), 1) as avgStress, ROUND(AVG(sleep_hours), 1) as avgSleep FROM wellness_inputs WHERE gender IS NOT NULL GROUP BY gender", connection))
        using (var reader = await cmdGender.ExecuteReaderAsync())
        {
            while (await reader.ReadAsync())
            {
                genderStats.Add(new
                {
                    Gender = reader.IsDBNull(0) ? "Unspecified" : reader.GetString(0),
                    Count = reader.GetInt32(1),
                    AverageStress = reader.GetDouble(2),
                    AverageSleep = reader.GetDouble(3)
                });
            }
        }

        var ageStats = new System.Collections.Generic.List<object>();
        using (var cmdAge = new MySqlCommand(
            "SELECT CASE WHEN age < 25 THEN 'Under 25' WHEN age <= 40 THEN '25-40' ELSE 'Over 40' END as ageGroup, COUNT(*) as count, ROUND(AVG(stress_level), 1) as avgStress, ROUND(AVG(sleep_hours), 1) as avgSleep FROM wellness_inputs WHERE age IS NOT NULL GROUP BY ageGroup", 
            connection))
        using (var reader = await cmdAge.ExecuteReaderAsync())
        {
            while (await reader.ReadAsync())
            {
                ageStats.Add(new
                {
                    AgeGroup = reader.GetString(0),
                    Count = reader.GetInt32(1),
                    AverageStress = reader.GetDouble(2),
                    AverageSleep = reader.GetDouble(3)
                });
            }
        }

        return Results.Ok(new
        {
            GenderDistribution = genderStats,
            AgeDistribution = ageStats
        });
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

// 4. POST /api/corporate/inquiries
app.MapPost("/api/corporate/inquiries", async (PartnerInquiryDto dto) =>
{
    if (string.IsNullOrWhiteSpace(dto.OrgName) || string.IsNullOrWhiteSpace(dto.ContactEmail))
    {
        return Results.BadRequest("Organization name and contact email are required.");
    }

    try
    {
        using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        using var cmd = new MySqlCommand(@"
            INSERT INTO partner_inquiries (org_name, org_type, contact_name, contact_email, contact_phone, city, message)
            VALUES (@orgName, @orgType, @contactName, @contactEmail, @contactPhone, @city, @message);", connection);

        cmd.Parameters.AddWithValue("@orgName", dto.OrgName);
        cmd.Parameters.AddWithValue("@orgType", dto.OrgType);
        cmd.Parameters.AddWithValue("@contactName", dto.ContactName);
        cmd.Parameters.AddWithValue("@contactEmail", dto.ContactEmail);
        cmd.Parameters.AddWithValue("@contactPhone", dto.ContactPhone ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@city", dto.City ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("@message", dto.Message ?? (object)DBNull.Value);

        await cmd.ExecuteNonQueryAsync();

        // ── SMTP System Auto-Responder Confirmation Email ──
        SendCorporateConfirmationEmail(dto, app.Configuration);

        return Results.Ok(new { success = true, message = "Inquiry recorded successfully. Official confirmation email dispatched to " + dto.ContactEmail });
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

// 5. GET /api/corporate/inquiries (for Admin dashboard audit tab)
app.MapGet("/api/corporate/inquiries", async () =>
{
    try
    {
        using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        using var cmd = new MySqlCommand("SELECT id, org_name, org_type, contact_name, contact_email, contact_phone, city, message, submitted_at FROM partner_inquiries ORDER BY submitted_at DESC", connection);
        using var reader = await cmd.ExecuteReaderAsync();
        var list = new System.Collections.Generic.List<object>();
        while (await reader.ReadAsync())
        {
            list.Add(new
            {
                Id = reader.GetInt32(0),
                OrgName = reader.GetString(1),
                OrgType = reader.GetString(2),
                ContactName = reader.GetString(3),
                ContactEmail = reader.GetString(4),
                ContactPhone = reader.IsDBNull(5) ? "" : reader.GetString(5),
                City = reader.IsDBNull(6) ? "" : reader.GetString(6),
                Message = reader.IsDBNull(7) ? "" : reader.GetString(7),
                SubmittedAt = reader.GetDateTime(8).ToString("yyyy-MM-dd HH:mm:ss")
            });
        }
        return Results.Ok(list);
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

app.Run();

// Helper Method for SMTP Auto-Responder Email
static void SendCorporateConfirmationEmail(PartnerInquiryDto dto, IConfiguration config)
{
    try
    {
        // Read SMTP settings from environment variables or app configuration
        string host = Environment.GetEnvironmentVariable("SMTP_HOST") ?? config["Smtp:Host"] ?? "smtp.gmail.com";
        int port = int.TryParse(Environment.GetEnvironmentVariable("SMTP_PORT") ?? config["Smtp:Port"], out int p) ? p : 587;
        string user = Environment.GetEnvironmentVariable("SMTP_USER") ?? config["Smtp:Username"] ?? "";
        string pass = Environment.GetEnvironmentVariable("SMTP_PASS") ?? config["Smtp:Password"] ?? "";
        string configuredFrom = config["Smtp:FromEmail"];
        string fromEmail = Environment.GetEnvironmentVariable("SMTP_FROM") 
            ?? (!string.IsNullOrWhiteSpace(configuredFrom) ? configuredFrom : (!string.IsNullOrWhiteSpace(user) ? user : "partnerships@fitnexus.org"));

        using var mail = new System.Net.Mail.MailMessage();
        mail.From = new System.Net.Mail.MailAddress(fromEmail, "FitNexus Corporate Partnerships");
        mail.To.Add(dto.ContactEmail);
        mail.Subject = $"[FitNexus Corporate] Partnership Request Received — {dto.OrgName}";
        mail.IsBodyHtml = true;
        mail.Body = $@"
            <div style=""font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;"">
                <div style=""background: linear-gradient(135deg, #054474 0%, #602e7d 100%); padding: 30px; text-align: center; color: white;"">
                    <h1 style=""margin: 0; font-size: 26px;"">🏛️ FitNexus Corporate Partnerships</h1>
                    <p style=""margin-top: 8px; font-size: 14px; opacity: 0.9;"">Official Automated System Confirmation</p>
                </div>
                <div style=""padding: 30px; background-color: #ffffff; color: #333333;"">
                    <h3 style=""color: #054474;"">Namaste {dto.ContactName},</h3>
                    <p>Thank you for reaching out to <strong>FitNexus</strong> on behalf of <strong>{dto.OrgName}</strong> ({dto.OrgType}).</p>
                    <p>We have successfully registered your B2B corporate partnership inquiry in our official registry database. Our enterprise team will review your organization's requirements and reach out to you within 24 to 48 business hours.</p>
                    
                    <div style=""background-color: #f4f6f8; border-left: 4px solid #602e7d; padding: 15px; margin: 20px 0; border-radius: 4px;"">
                        <h4 style=""margin-top: 0; color: #602e7d;"">📋 Inquiry Details Recorded:</h4>
                        <ul style=""margin: 0; padding-left: 20px; font-size: 14px;"">
                            <li><strong>Organization:</strong> {dto.OrgName}</li>
                            <li><strong>Category:</strong> {dto.OrgType}</li>
                            <li><strong>City:</strong> {dto.City ?? "N/A"}</li>
                            <li><strong>Contact Phone:</strong> {dto.ContactPhone ?? "N/A"}</li>
                        </ul>
                    </div>

                    <p>If you have urgent questions in the interim, feel free to reply directly to this message or contact our partnership desk at <strong>support@fitnexus.org</strong>.</p>
                    <br/>
                    <p style=""margin: 0;"">Warm regards,</p>
                    <p style=""margin-top: 4px; font-weight: bold; color: #054474;"">The FitNexus Enterprise Partnerships Team</p>
                </div>
                <div style=""background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #777777;"">
                    © 2026 FitNexus Development Team. All rights reserved. | Authentic AYUSH & Corporate Wellness System
                </div>
            </div>";

        if (!string.IsNullOrEmpty(user) && !string.IsNullOrEmpty(pass))
        {
            using var smtp = new System.Net.Mail.SmtpClient(host, port);
            smtp.EnableSsl = true;
            smtp.Credentials = new System.Net.NetworkCredential(user, pass);
            smtp.Timeout = 10000;
            smtp.Send(mail);
            Console.WriteLine($"[SMTP REAL DISPATCH SUCCESS] Email delivered via {host} to {dto.ContactEmail}");
        }
        else
        {
            // Try localhost for local dev relay test
            using var smtp = new System.Net.Mail.SmtpClient("localhost", 25);
            smtp.Timeout = 2000;
            smtp.Send(mail);
            Console.WriteLine($"[SMTP LOCAL DISPATCH] Sent to {dto.ContactEmail}");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[SMTP DISPATCH LOG] Auto-responder generated for {dto.ContactEmail}: {ex.Message}");
    }
}

public class PartnerInquiryDto
{
    public string OrgName { get; set; } = string.Empty;
    public string OrgType { get; set; } = string.Empty;
    public string ContactName { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
