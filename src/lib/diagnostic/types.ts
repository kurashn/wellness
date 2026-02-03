export type AnswerValue = number;

export interface Option {
    id: string;
    label: string;
    value: AnswerValue;
    triggerSafety?: boolean; // If true, immediate safety warning
}

export interface Question {
    id: string;
    text: string;
    type: 'single' | 'confirm'; // confirm is for "Next" or "Yes/No" gates
    options: Option[];
    section: 'consent' | 'phq4' | 'who5' | 'pss4' | 'sleep' | 'activity' | 'symptom_check';
}

export interface DiagnosticState {
    answers: Record<string, AnswerValue>;
    currentQuestionIndex: number;
    isComplete: boolean;
    scores: {
        phq4: number; // 0-12
        who5: number; // 0-100
        pss4: number; // 0-16
        sleep: number; // 0-15
        activity: 'Low' | 'Medium' | 'High';
        symptoms?: {
            main: string;
            focus: string;
            body: string;
        };
    };
    details: {
        phq4_level: 'Low' | 'Mild' | 'Moderate' | 'High';
        who5_level: 'Good' | 'Low' | 'Critical';
        pss4_level: 'Low' | 'High';
        sleep_level: 'Good' | 'Fair' | 'Poor';
    }
}

export type Theme = 'Sleep' | 'Mental Recovery' | 'Stress Relief' | 'Active' | 'Balance';

export interface Recommendation {
    id: string;
    title: string;
    description: string;
    type: 'action' | 'experience' | 'event' | 'product';
    intensity: 'Low' | 'Medium' | 'High';
    tags: string[]; // Allow broader tags like 'Nature'
    price?: string;
    location?: string;
    link?: string;
    image?: string; // URL to image
    badge?: string; // e.g. "Best Seller", "New"
}

export interface DiagnosticResult {
    theme: Theme;
    summary: string;
    warnings: string[];
    observations: string[]; // New field for specific logic insights
    scores: DiagnosticState['scores']; // Included for displaying graphs/indices
    humanOS: {
        cpuLoad: number; // 0-100 (Stress + Anxiety)
        batteryLevel: number; // 0-100 (Sleep + Vitality)
        osStability: number; // 0-100 (Emotional stability)
        specifics?: {
            main: string;
            focus: string;
            body: string;
        };
    };
    recommendations: {
        today: Recommendation[];
        week: Recommendation[];
        weekend: Recommendation[];
        products: Recommendation[];
    };
}
