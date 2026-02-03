import { Question, Recommendation } from './types';

export const QUESTIONS: Question[] = [
    // --- Consent ---
    {
        id: 'consent',
        text: 'consent',
        type: 'confirm',
        section: 'consent',
        options: [
            { id: 'agree', label: 'consent_opt_agree', value: 1 },
        ]
    },
    // --- PHQ-4 (Anxiety/Depression) ---
    {
        id: 'phq_1',
        text: 'phq_1',
        type: 'single',
        section: 'phq4',
        options: [
            { id: '0', label: 'not_at_all', value: 0 },
            { id: '1', label: 'several_days', value: 1 },
            { id: '2', label: 'more_half', value: 2 },
            { id: '3', label: 'nearly_every', value: 3 },
        ]
    },
    {
        id: 'phq_2',
        text: 'phq_2',
        type: 'single',
        section: 'phq4',
        options: [
            { id: '0', label: 'not_at_all', value: 0 },
            { id: '1', label: 'several_days', value: 1 },
            { id: '2', label: 'more_half', value: 2 },
            { id: '3', label: 'nearly_every', value: 3 },
        ]
    },
    {
        id: 'phq_3',
        text: 'phq_3',
        type: 'single',
        section: 'phq4',
        options: [
            { id: '0', label: 'not_at_all', value: 0 },
            { id: '1', label: 'several_days', value: 1 },
            { id: '2', label: 'more_half', value: 2 },
            { id: '3', label: 'nearly_every', value: 3 },
        ]
    },
    {
        id: 'phq_4',
        text: 'phq_4',
        type: 'single',
        section: 'phq4',
        options: [
            { id: '0', label: 'not_at_all', value: 0 },
            { id: '1', label: 'several_days', value: 1 },
            { id: '2', label: 'more_half', value: 2 },
            { id: '3', label: 'nearly_every', value: 3 },
        ]
    },
    // --- WHO-5 (Wellbeing) ---
    {
        id: 'who_1',
        text: 'who_1',
        type: 'single',
        section: 'who5',
        options: [
            { id: '5', label: 'all_time', value: 5 },
            { id: '4', label: 'most_time', value: 4 },
            { id: '3', label: 'more_half', value: 3 },
            { id: '2', label: 'less_half', value: 2 },
            { id: '1', label: 'some_time', value: 1 },
            { id: '0', label: 'at_no_time', value: 0 },
        ]
    },
    {
        id: 'who_2',
        text: 'who_2',
        type: 'single',
        section: 'who5',
        options: [
            { id: '5', label: 'all_time', value: 5 },
            { id: '4', label: 'most_time', value: 4 },
            { id: '3', label: 'more_half', value: 3 },
            { id: '2', label: 'less_half', value: 2 },
            { id: '1', label: 'some_time', value: 1 },
            { id: '0', label: 'at_no_time', value: 0 },
        ]
    },
    {
        id: 'who_3',
        text: 'who_3',
        type: 'single',
        section: 'who5',
        options: [
            { id: '5', label: 'all_time', value: 5 },
            { id: '4', label: 'most_time', value: 4 },
            { id: '3', label: 'more_half', value: 3 },
            { id: '2', label: 'less_half', value: 2 },
            { id: '1', label: 'some_time', value: 1 },
            { id: '0', label: 'at_no_time', value: 0 },
        ]
    },
    {
        id: 'who_4',
        text: 'who_4',
        type: 'single',
        section: 'who5',
        options: [
            { id: '5', label: 'all_time', value: 5 },
            { id: '4', label: 'most_time', value: 4 },
            { id: '3', label: 'more_half', value: 3 },
            { id: '2', label: 'less_half', value: 2 },
            { id: '1', label: 'some_time', value: 1 },
            { id: '0', label: 'at_no_time', value: 0 },
        ]
    },
    {
        id: 'who_5',
        text: 'who_5',
        type: 'single',
        section: 'who5',
        options: [
            { id: '5', label: 'all_time', value: 5 },
            { id: '4', label: 'most_time', value: 4 },
            { id: '3', label: 'more_half', value: 3 },
            { id: '2', label: 'less_half', value: 2 },
            { id: '1', label: 'some_time', value: 1 },
            { id: '0', label: 'at_no_time', value: 0 },
        ]
    },
    // --- Sleep Check ---
    {
        id: 'sleep_1',
        text: 'sleep_1',
        type: 'single',
        section: 'sleep',
        options: [
            { id: '0', label: 'never', value: 0 },
            { id: '1', label: 'sometimes', value: 1 },
            { id: '2', label: 'often', value: 2 },
            { id: '3', label: 'always', value: 3 },
        ]
    },
    {
        id: 'sleep_2',
        text: 'sleep_2',
        type: 'single',
        section: 'sleep',
        options: [
            { id: '0', label: 'never', value: 0 },
            { id: '1', label: 'sometimes', value: 1 },
            { id: '2', label: 'often', value: 2 },
            { id: '3', label: 'always', value: 3 },
        ]
    },
    {
        id: 'sleep_3',
        text: 'sleep_3',
        type: 'single',
        section: 'sleep',
        options: [
            { id: '0', label: 'always', value: 0 },
            { id: '1', label: 'often', value: 1 },
            { id: '2', label: 'sometimes', value: 2 },
            { id: '3', label: 'never', value: 3 },
        ]
    },
    {
        id: 'sleep_4',
        text: 'sleep_4',
        type: 'single',
        section: 'sleep',
        options: [
            { id: '0', label: 'never', value: 0 },
            { id: '1', label: 'sometimes', value: 1 },
            { id: '2', label: 'often', value: 2 },
            { id: '3', label: 'always', value: 3 },
        ]
    },
    {
        id: 'sleep_5',
        text: 'sleep_5',
        type: 'single',
        section: 'sleep',
        options: [
            { id: '0', label: 'no_regular', value: 0 },
            { id: '1', label: 'slightly', value: 1 },
            { id: '2', label: 'moderately', value: 2 },
            { id: '3', label: 'very_irregular', value: 3 },
        ]
    },
    // --- PSS-4 (Stress) ---
    {
        id: 'pss_1',
        text: 'pss_1',
        type: 'single',
        section: 'pss4',
        options: [
            { id: '0', label: 'never', value: 0 },
            { id: '1', label: 'almost_never', value: 1 },
            { id: '2', label: 'sometimes', value: 2 },
            { id: '3', label: 'fairly_often', value: 3 },
            { id: '4', label: 'very_often', value: 4 },
        ]
    },
    {
        id: 'pss_2',
        text: 'pss_2',
        type: 'single',
        section: 'pss4',
        options: [
            { id: '4', label: 'never', value: 4 },
            { id: '3', label: 'almost_never', value: 3 },
            { id: '2', label: 'sometimes', value: 2 },
            { id: '1', label: 'fairly_often', value: 1 },
            { id: '0', label: 'very_often', value: 0 },
        ]
    },
    {
        id: 'pss_3',
        text: 'pss_3',
        type: 'single',
        section: 'pss4',
        options: [
            { id: '4', label: 'never', value: 4 },
            { id: '3', label: 'almost_never', value: 3 },
            { id: '2', label: 'sometimes', value: 2 },
            { id: '1', label: 'fairly_often', value: 1 },
            { id: '0', label: 'very_often', value: 0 },
        ]
    },
    {
        id: 'pss_4',
        text: 'pss_4',
        type: 'single',
        section: 'pss4',
        options: [
            { id: '0', label: 'never', value: 0 },
            { id: '1', label: 'almost_never', value: 1 },
            { id: '2', label: 'sometimes', value: 2 },
            { id: '3', label: 'fairly_often', value: 3 },
            { id: '4', label: 'very_often', value: 4 },
        ]
    },
    // --- Activity ---
    {
        id: 'act_1',
        text: 'act_1',
        type: 'single',
        section: 'activity',
        options: [
            { id: '0', label: 'days_0', value: 0 },
            { id: '1', label: 'days_1_2', value: 1 },
            { id: '2', label: 'days_3_plus', value: 3 }, // value represents days
        ]
    },
    {
        id: 'act_2',
        text: 'act_2',
        type: 'single',
        section: 'activity',
        options: [
            { id: '0', label: 'days_0', value: 0 },
            { id: '1', label: 'days_1_2', value: 1 },
            { id: '2', label: 'days_3_4', value: 3 },
            { id: '3', label: 'days_5_plus', value: 5 },
        ]
    },
    {
        id: 'act_3',
        text: 'act_3',
        type: 'single',
        section: 'activity',
        options: [
            { id: '0', label: 'days_0', value: 0 },
            { id: '1', label: 'days_1_2', value: 1 },
            { id: '2', label: 'days_3_4', value: 3 },
            { id: '3', label: 'days_5_plus', value: 5 },
        ]
    },
    // --- Symptom Check (High Resolution) ---
    {
        id: 'symptom_main',
        text: 'symptom_main',
        type: 'single',
        section: 'symptom_check',
        options: [
            { id: 'brain', label: 'symptom_brain', value: 0 },
            { id: 'body', label: 'symptom_body', value: 1 },
            { id: 'eyes', label: 'symptom_eyes', value: 2 },
            { id: 'mood', label: 'symptom_mood', value: 3 },
        ]
    },
    {
        id: 'symptom_focus',
        text: 'symptom_focus',
        type: 'single',
        section: 'symptom_check',
        options: [
            { id: 'good', label: 'symptom_focus_good', value: 0 },
            { id: 'distracted', label: 'symptom_focus_distracted', value: 1 },
            { id: 'foggy', label: 'symptom_focus_foggy', value: 2 },
        ]
    },
    {
        id: 'symptom_body_feel',
        text: 'symptom_body_feel',
        type: 'single',
        section: 'symptom_check',
        options: [
            { id: 'normal', label: 'symptom_body_normal', value: 0 },
            { id: 'tense', label: 'symptom_body_tense', value: 1 },
            { id: 'heavy', label: 'symptom_body_heavy', value: 2 },
        ]
    }
];

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
    // --- Products (Affiliate / High Value) ---
    {
        id: 'p01',
        title: 'p01_title',
        description: 'p01_desc',
        type: 'product',
        intensity: 'Low',
        tags: ['Sleep', 'Balance', 'Active'],
        price: 'From $299',
        link: '#',
        image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=800&auto=format&fit=crop',
        badge: 'Recommended'
    },
    {
        id: 'p02',
        title: 'p02_title',
        description: 'p02_desc',
        type: 'product',
        intensity: 'Low',
        tags: ['Sleep', 'Stress Relief'],
        price: '฿590',
        link: '#',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 'p03',
        title: 'p03_title',
        description: 'p03_desc',
        type: 'product',
        intensity: 'Low',
        tags: ['Stress Relief', 'Mental Recovery', 'Balance'],
        price: '฿850',
        link: '#',
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 'p04',
        title: 'p04_title',
        description: 'p04_desc',
        type: 'product',
        intensity: 'Medium',
        tags: ['Active', 'Balance'],
        price: '฿1,200',
        link: '#',
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 'p05',
        title: 'p05_title',
        description: 'p05_desc',
        type: 'product',
        intensity: 'Low',
        tags: ['Mental Recovery', 'Stress Relief'],
        price: '฿8,900',
        link: '#',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop'
    },

    // --- Actions (Today's Micro-Habits) ---
    {
        id: 'a01',
        title: 'a01_title',
        description: 'a01_desc',
        type: 'action',
        intensity: 'Low',
        tags: ['Stress Relief', 'Mental Recovery'],
        link: '/guide/breathing',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 'a02',
        title: 'a02_title',
        description: 'a02_desc',
        type: 'action',
        intensity: 'Low',
        tags: ['Sleep', 'Mental Recovery'],
        link: '/guide/sleep_hygiene',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 'a03',
        title: 'a03_title',
        description: 'a03_desc',
        type: 'action',
        intensity: 'Medium',
        tags: ['Active', 'Balance', 'Sleep'],
        link: '/guide/morning_routine',
        image: 'https://images.unsplash.com/photo-1506452819137-b4a68e13cd3e?q=80&w=800&auto=format&fit=crop'
    },

    // --- Experiences (Spa / Gym / Cafe) ---
    {
        id: 'e01',
        title: 'e01_title',
        description: 'e01_desc',
        type: 'experience',
        intensity: 'Low',
        tags: ['Stress Relief', 'Mental Recovery', 'Sleep'],
        location: 'Chit Lom, Bangkok',
        price: 'From ฿750',
        link: '#',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
        badge: 'Partner'
    },
    {
        id: 'e02',
        title: 'e02_title',
        description: 'e02_desc',
        type: 'experience',
        intensity: 'Low',
        tags: ['Balance', 'Mental Recovery'],
        location: 'Thong Lor',
        price: '฿300 - ฿800',
        link: '#',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 'e03',
        title: 'e03_title',
        description: 'e03_desc',
        type: 'experience',
        intensity: 'High',
        tags: ['Active', 'Stress Relief'],
        location: 'Asoke',
        price: '฿550 / session',
        link: '#',
        image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=800&auto=format&fit=crop'
    },

    // --- Events (Weekend Retreats) ---
    {
        id: 'w01',
        title: 'w01_title',
        description: 'w01_desc',
        type: 'event',
        intensity: 'Medium',
        tags: ['Nature', 'Balance', 'Mental Recovery'],
        location: 'Bang Kachao',
        price: '฿1,500',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop',
        badge: 'Popular'
    },
    {
        id: 'w02',
        title: 'w02_title',
        description: 'w02_desc',
        type: 'event',
        intensity: 'Low',
        tags: ['Mental Recovery', 'Stress Relief'],
        location: 'Charoen Nakhon',
        price: '฿1,800',
        link: '#',
        image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?q=80&w=800&auto=format&fit=crop'
    }
];
