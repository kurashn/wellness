import { AnswerValue, DiagnosticResult, DiagnosticState, Recommendation, Theme } from './types';
import { MOCK_RECOMMENDATIONS, QUESTIONS } from './data';

export const calculateScores = (answers: Record<string, AnswerValue>): DiagnosticState['scores'] => {
    let phq4 = 0;
    let who5 = 0;
    let pss4 = 0;
    let sleep = 0;
    const activityScore: { high: number, mod: number, walk: number } = { high: 0, mod: 0, walk: 0 };
    const symptomScore: { main: number, focus: number, body: number } = { main: 0, focus: 0, body: 0 };

    Object.entries(answers).forEach(([key, value]) => {
        if (key.startsWith('phq_')) phq4 += value;
        if (key.startsWith('who_')) who5 += value;
        if (key.startsWith('pss_')) pss4 += value;
        if (key.startsWith('sleep_')) sleep += value;

        // Activity special handling
        if (key === 'act_1') activityScore.high = value;
        if (key === 'act_2') activityScore.mod = value;
        if (key === 'act_3') activityScore.walk = value;

        // Symptom special handling
        if (key === 'symptom_main') symptomScore.main = value;
        if (key === 'symptom_focus') symptomScore.focus = value;
        if (key === 'symptom_body_feel') symptomScore.body = value;
    });

    // Calculate Activity Level
    let activity: 'Low' | 'Medium' | 'High' = 'Low';
    if (activityScore.high >= 3 || activityScore.mod >= 5) {
        activity = 'High';
    } else if (activityScore.mod >= 3 || activityScore.walk >= 5) {
        activity = 'Medium';
    }

    return {
        phq4,
        who5: who5 * 4, // 0-25 -> 0-100
        pss4,
        sleep,
        activity,
        symptoms: {
            main: ['brain', 'body', 'eyes', 'mood'][symptomScore.main] || 'brain',
            focus: ['good', 'distracted', 'foggy'][symptomScore.focus] || 'good',
            body: ['normal', 'tense', 'heavy'][symptomScore.body] || 'normal'
        }
    };
};

export const determineTheme = (scores: DiagnosticState['scores']): Theme => {
    // Priority 1: Sleep
    if (scores.sleep >= 8) return 'Sleep';

    // Priority 2: Mental Recovery (PHQ-4 >= 6 or WHO-5 < 50)
    if (scores.phq4 >= 6 || scores.who5 < 50) return 'Mental Recovery';

    // Priority 3: Stress (PSS-4 >= 10)
    if (scores.pss4 >= 10) return 'Stress Relief';

    // Priority 4: Activity (Low activity)
    if (scores.activity === 'Low') return 'Active';

    // Default
    return 'Balance';
};

export const generateResult = (scores: DiagnosticState['scores']): DiagnosticResult => {
    const theme = determineTheme(scores);
    const warnings: string[] = [];
    const observations: string[] = [];

    // Safety Warnings (Keys)
    if (scores.phq4 >= 9) {
        warnings.push("warning_phq");
    }
    if (scores.sleep >= 10) {
        warnings.push("warning_sleep");
    }

    // Detailed Observations (New Logic)
    // These keys will be added to ja.json/en.json
    if (scores.sleep >= 8) observations.push("obs_sleep_poor");
    if (scores.phq4 >= 6) observations.push("obs_mental_strain");
    if (scores.pss4 >= 8) observations.push("obs_high_stress");
    if (scores.activity === 'Low') observations.push("obs_sedentary");
    if (scores.who5 > 70 && scores.phq4 < 3) observations.push("obs_good_state");


    // Summary Keys Construction
    let summary = `summary_balance`;
    if (theme === 'Sleep') summary = "summary_sleep";
    if (theme === 'Mental Recovery') summary = "summary_mental";
    if (theme === 'Stress Relief') summary = "summary_stress";
    if (theme === 'Active') summary = "summary_active";
    if (theme === 'Balance') summary = "summary_balance";

    // Filter Recommendations
    const filterRecs = (type: Recommendation['type'], max: number) => {
        let matches = MOCK_RECOMMENDATIONS.filter(r => r.type === type && r.tags.includes(theme));

        // Fallback if no specific matches
        if (matches.length === 0) {
            matches = MOCK_RECOMMENDATIONS.filter(r => r.type === type && r.tags.some(t => ['Balance', 'Stress Relief'].includes(t)));
        }

        // Safety filter: If 'Sleep' or 'Mental Recovery' is theme, avoid 'High' intensity
        if (['Sleep', 'Mental Recovery'].includes(theme)) {
            matches = matches.filter(r => r.intensity !== 'High');
        }

        return matches.slice(0, max);
    };

    // Human OS Metrics Calculation
    // CPU Load: (PSS4 score / 16) * 60 + (PHQ4 score / 12) * 40
    // If PSS is high, CPU is processing too much. If PHQ is high, it's overheating.
    const cpuLoad = Math.min(100, Math.round((scores.pss4 / 16) * 60 + (scores.phq4 / 12) * 40));

    // Battery Level -> Body Fatigue (Lower is better)
    // Original: (WHO5 * 0.7 + SleepQuality * 0.3). This was Energy (0-100).
    // New: 100 - Energy = Body Fatigue.
    // Sleep is 0-15 (higher is bad). sleepQuality = ((15-sleep)/15)*100 (higher is good).
    const sleepQuality = ((15 - Math.min(15, scores.sleep)) / 15) * 100;
    const energyLevel = Math.min(100, Math.round(scores.who5 * 0.7 + sleepQuality * 0.3));
    const bodyFatigue = Math.max(0, 100 - energyLevel);

    // OS Stability -> Mental Fatigue (Lower is better)
    // Instability was (PHQ4 * 6) + (PSS4 * 2). Max approx 104.
    // Original: 100 - instability.
    // New: instability directly (capped at 100).
    const instability = (scores.phq4 * 6) + (scores.pss4 * 2);
    const mentalFatigue = Math.min(100, instability);

    return {
        theme,
        summary, // Main summary key
        warnings, // Array of translation keys
        observations, // NEW: Array of specific observations
        scores, // Pass calculated scores
        humanOS: {
            cpuLoad, // Brain Fatigue (Already lower is better/Stress based)
            batteryLevel: bodyFatigue, // Storing as "Body Fatigue" in the same slot
            osStability: mentalFatigue, // Storing as "Mental Fatigue" in the same slot
            specifics: scores.symptoms
        },
        recommendations: {
            today: filterRecs('action', 1),
            week: filterRecs('experience', 2),
            weekend: filterRecs('event', 1),
            products: filterRecs('product', 2)
        }
    };
};
