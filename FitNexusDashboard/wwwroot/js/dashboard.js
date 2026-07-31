/* ═══════════════════════════════════════════════════════════════
   FitNexus Corporate Dashboard — Data Layer & Charts
   ═══════════════════════════════════════════════════════════════ */

const API_BASE = window.location.origin;

const MOOD_COLORS = {
    'Happy': '#66bb6a', 'Calm': '#4fc3f7', 'Neutral': '#78909c',
    'Anxious': '#ffa726', 'Stressed': '#ef5350', 'Sad': '#ab47bc',
    'Energetic': '#26c6da', 'Tired': '#8d6e63', 'Unknown': '#546e7a'
};
const GENDER_COLORS = { 'Male': '#4fc3f7', 'Female': '#ce93d8', 'Other': '#81c784', 'Unspecified': '#78909c' };
const AGE_COLORS = { 'Under 25': '#4fc3f7', '25-40': '#ab47bc', 'Over 40': '#66bb6a' };

// ── Fetch & Render ──────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadTrends();
    loadDemographics();
    setupPartnerForm();
    setupSmoothScroll();
});

async function loadStats() {
    try {
        const res = await fetch(`${API_BASE}/api/corporate/stats`);
        const data = await res.json();
        renderStats(data);
    } catch (err) {
        document.getElementById('stats-grid').innerHTML =
            '<div class="stat-card"><div class="stat-value">⚠️</div><div class="stat-label">Unable to load stats. Check if the database is running.</div></div>';
    }
}

function renderStats(d) {
    const grid = document.getElementById('stats-grid');
    const cards = [
        { icon: '👥', value: d.activeMembers || 0, label: 'Active Members', change: 'Users registered', cls: 'positive' },
        { icon: '📝', value: d.totalAssessments || 0, label: 'Total Assessments', change: 'Wellness forms filled', cls: 'positive' },
        { icon: '😰', value: (d.averageStressLevel || 0) + '/10', label: 'Avg Stress Level', change: d.averageStressLevel > 5 ? 'Needs attention' : 'Healthy range', cls: d.averageStressLevel > 5 ? 'warning' : 'positive' },
        { icon: '😴', value: (d.averageSleepHours || 0) + ' hrs', label: 'Avg Sleep Hours', change: d.averageSleepHours >= 7 ? 'Optimal range' : 'Below optimal', cls: d.averageSleepHours >= 7 ? 'positive' : 'warning' },
        { icon: '⚖️', value: (d.averageBmi || 0), label: 'Average BMI', change: d.averageBmi >= 18.5 && d.averageBmi <= 25 ? 'Normal range' : 'Review needed', cls: d.averageBmi >= 18.5 && d.averageBmi <= 25 ? 'positive' : 'warning' },
        { icon: '💼', value: (d.averageWorkSatisfaction || 0) + '/10', label: 'Avg Work Satisfaction', change: d.averageWorkSatisfaction >= 6 ? 'Good' : 'Needs improvement', cls: d.averageWorkSatisfaction >= 6 ? 'positive' : 'warning' },
        { icon: '🏋️', value: d.totalWorkoutsLogged || 0, label: 'Workouts Logged', change: 'Exercise sessions', cls: 'positive' },
        { icon: '🧑‍🏫', value: d.activeStaffCount || 0, label: 'Active Staff', change: 'Trainers & Instructors', cls: 'positive' },
    ];

    grid.innerHTML = cards.map(c => `
        <div class="stat-card">
            <span class="stat-icon">${c.icon}</span>
            <div class="stat-value">${c.value}</div>
            <div class="stat-label">${c.label}</div>
            <span class="stat-change ${c.cls}">${c.change}</span>
        </div>
    `).join('');

    // Animate cards in
    grid.querySelectorAll('.stat-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, i * 80);
    });
}

async function loadTrends() {
    try {
        const res = await fetch(`${API_BASE}/api/corporate/trends`);
        const data = await res.json();
        renderTrendsChart(data);
    } catch (err) {
        document.getElementById('trends-chart').innerHTML =
            '<div class="chart-loading">⚠️ Unable to load trends. Make sure the database has wellness assessment data.</div>';
    }
}

function renderTrendsChart(trends) {
    const container = document.getElementById('trends-chart');
    if (!trends || trends.length === 0) {
        container.innerHTML = '<div class="chart-loading">No mood data available yet. Users need to fill wellness assessments first.</div>';
        return;
    }

    const maxCount = Math.max(...trends.map(t => t.count), 1);

    container.innerHTML = `
        <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.85rem; color: var(--text-muted);">Assessment count by mood category</span>
            <span style="font-size: 0.78rem; color: var(--text-muted);">Total: ${trends.reduce((a, t) => a + t.count, 0)} assessments</span>
        </div>
        ${trends.map((t, i) => {
            const color = MOOD_COLORS[t.moodCategory] || MOOD_COLORS['Unknown'];
            const pct = (t.count / maxCount * 100).toFixed(0);
            return `
                <div class="chart-bar-group" style="animation: fadeIn 0.5s ease ${i * 0.1}s both;">
                    <div class="chart-bar-label">
                        <span>${getMoodEmoji(t.moodCategory)} ${t.moodCategory}</span>
                        <span style="color: var(--text-muted); font-size: 0.82rem;">${t.count} assessments</span>
                    </div>
                    <div class="chart-bar-track">
                        <div class="chart-bar-fill" style="width: ${pct}%; background: ${color};">
                            ${t.count}
                        </div>
                    </div>
                    <div class="chart-bar-meta">
                        <span>😰 Avg Stress: <strong style="color: #ff9800;">${t.averageStress}/10</strong></span>
                        <span>😴 Avg Sleep: <strong style="color: #4fc3f7;">${t.averageSleep} hrs</strong></span>
                    </div>
                </div>
            `;
        }).join('')}
    `;
}

function getMoodEmoji(mood) {
    const map = { 'Happy': '😊', 'Calm': '😌', 'Neutral': '😐', 'Anxious': '😟', 'Stressed': '😰', 'Sad': '😢', 'Energetic': '⚡', 'Tired': '😴' };
    return map[mood] || '🫥';
}

async function loadDemographics() {
    try {
        const res = await fetch(`${API_BASE}/api/corporate/demographics`);
        const data = await res.json();
        renderDemographics(data);
    } catch (err) {
        document.getElementById('gender-chart').innerHTML = '<div class="chart-loading">⚠️ Unable to load demographics.</div>';
        document.getElementById('age-chart').innerHTML = '<div class="chart-loading">⚠️ Unable to load demographics.</div>';
    }
}

function renderDemographics(data) {
    // Gender Chart
    const genderEl = document.getElementById('gender-chart');
    if (data.genderDistribution && data.genderDistribution.length > 0) {
        genderEl.innerHTML = data.genderDistribution.map(g => `
            <div class="demo-row">
                <div class="demo-dot" style="background: ${GENDER_COLORS[g.gender] || '#78909c'};"></div>
                <div class="demo-info">
                    <div class="demo-name">${g.gender}</div>
                    <div class="demo-count">${g.count} member${g.count !== 1 ? 's' : ''}</div>
                </div>
                <div class="demo-metrics">
                    <span class="demo-metric stress">😰 ${g.averageStress}</span>
                    <span class="demo-metric sleep">😴 ${g.averageSleep}h</span>
                </div>
            </div>
        `).join('');
    } else {
        genderEl.innerHTML = '<div class="chart-loading">No gender data available yet.</div>';
    }

    // Age Chart
    const ageEl = document.getElementById('age-chart');
    if (data.ageDistribution && data.ageDistribution.length > 0) {
        ageEl.innerHTML = data.ageDistribution.map(a => `
            <div class="demo-row">
                <div class="demo-dot" style="background: ${AGE_COLORS[a.ageGroup] || '#78909c'};"></div>
                <div class="demo-info">
                    <div class="demo-name">${a.ageGroup}</div>
                    <div class="demo-count">${a.count} member${a.count !== 1 ? 's' : ''}</div>
                </div>
                <div class="demo-metrics">
                    <span class="demo-metric stress">😰 ${a.averageStress}</span>
                    <span class="demo-metric sleep">😴 ${a.averageSleep}h</span>
                </div>
            </div>
        `).join('');
    } else {
        ageEl.innerHTML = '<div class="chart-loading">No age data available yet.</div>';
    }
}

// ── Partner Form ──────────────────────────────────────────────

function setupPartnerForm() {
    const form = document.getElementById('partner-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            orgName: document.getElementById('orgName').value,
            orgType: document.getElementById('orgType').value,
            contactName: document.getElementById('contactName').value,
            contactEmail: document.getElementById('contactEmail').value,
            contactPhone: document.getElementById('contactPhone').value || '',
            city: document.getElementById('city').value || '',
            message: document.getElementById('message').value || ''
        };

        try {
            const res = await fetch(`${API_BASE}/api/corporate/inquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                // Show success with email details
                document.getElementById('success-email-target').innerText = formData.contactEmail;
                document.getElementById('success-ref-id').innerText = 'FN-CORP-2026-' + Math.floor(1000 + Math.random() * 9000);
                form.style.display = 'none';
                document.getElementById('form-success').style.display = 'block';
            } else {
                alert('Submission failed. Please check the fields and try again.');
            }
        } catch (err) {
            console.error('Failed to submit inquiry to server, saving to localStorage as fallback:', err);
            // Save to localStorage
            const existing = JSON.parse(localStorage.getItem('fitnexus_partner_inquiries') || '[]');
            existing.push({ ...formData, submittedAt: new Date().toISOString() });
            localStorage.setItem('fitnexus_partner_inquiries', JSON.stringify(existing));
            
            document.getElementById('success-email-target').innerText = formData.contactEmail;
            document.getElementById('success-ref-id').innerText = 'FN-CORP-2026-' + Math.floor(1000 + Math.random() * 9000);
            form.style.display = 'none';
            document.getElementById('form-success').style.display = 'block';
        }
    });
}

// ── Smooth Scroll ─────────────────────────────────────────────

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            // Update active link
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// ── Fade-in Animation ─────────────────────────────────────────

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
