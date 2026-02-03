'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveDiagnosticResult(result: any) {
    const { auth } = await import("@/auth");
    const session = await auth();

    // We will use the session user ID if available, otherwise no user ID (anonymous)
    // Note: You need to make sure 'user_id' in DB points to 'users' table or is just uuid.
    // If your diagnostic_logs table references auth.users(id), and you are using NextAuth valid user IDs (from public.users), 
    // you might need to drop the FK constraint or change it.

    // Flatten result
    const logData = {
        user_id: session?.user?.id || null,
        cpu_load: result.humanOS.cpuLoad,
        battery_level: result.humanOS.batteryLevel,
        os_stability: result.humanOS.osStability,
        theme: result.theme,
        summary: result.summary,
        result_json: result,
        created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from('diagnostic_logs')
        .insert([logData])
        .select();

    if (error) {
        console.error('Error saving diagnostic result:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

// Quick update function - takes 3 simple slider values (0-100)
// stress: higher = more stressed, energy: higher = more energy, mood: higher = better mood
export async function quickUpdateStatus(stress: number, energy: number, mood: number) {
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) {
        return { success: false, error: "Not authenticated" };
    }

    // Calculate metrics from simple inputs
    // CPU Load (stress level): directly from stress input
    const cpuLoad = Math.round(stress);

    // Battery Level: combination of energy and mood
    const batteryLevel = Math.round((energy * 0.7 + mood * 0.3));

    // OS Stability: inverse of stress combined with mood
    const osStability = Math.round(((100 - stress) * 0.5 + mood * 0.5));

    // Determine theme based on inputs
    let theme = 'Balance';
    if (stress > 70) theme = 'Stress Relief';
    else if (energy < 40) theme = 'Active';
    else if (mood < 50) theme = 'Mental Recovery';

    const logData = {
        user_id: session.user.id,
        cpu_load: cpuLoad,
        battery_level: batteryLevel,
        os_stability: osStability,
        theme: theme,
        summary: 'quick_update',
        result_json: {
            humanOS: { cpuLoad, batteryLevel, osStability },
            theme,
            quickUpdate: true,
            inputs: { stress, energy, mood }
        },
        created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from('diagnostic_logs')
        .insert([logData])
        .select();

    if (error) {
        console.error('Error saving quick update:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data: data[0] };
}

export async function getLatestDiagnosticLog() {
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) return null;

    const { data, error } = await supabase
        .from('diagnostic_logs')
        .select('*')
        .eq('user_id', session.user.id) // Filter by user!
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        // It's okay if no data found initially
        return null;
    }

    // If latest log has no recommendations (e.g. Quick Update), fetch the last log that DID have them
    if (data && !data.result_json?.recommendations) {
        const { data: recData } = await supabase
            .from('diagnostic_logs')
            .select('result_json')
            .eq('user_id', session.user.id)
            .not('result_json->recommendations', 'is', null) // JSONB operator check might need care, usually simpler to sort and filter in app if volume low, but here:
            .order('created_at', { ascending: false })
            .limit(2); // Fetch 2 just in case

        // Find first one with recommendations
        const backup = recData?.find((d: any) => d.result_json?.recommendations?.today?.length > 0);

        if (backup) {
            // Merge recommendations into the latest log object
            if (!data.result_json) data.result_json = {};
            data.result_json.recommendations = backup.result_json.recommendations;
        }
    }

    return data;
}

export async function getPreviousDiagnosticLog() {
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) return null;

    const { data, error } = await supabase
        .from('diagnostic_logs')
        .select('cpu_load, battery_level, os_stability, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(2);

    if (error || !data || data.length < 2) {
        return null;
    }

    // Return the second most recent (index 1)
    return data[1];
}

export async function getDiagnosticHistory() {
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) return [];

    const { data, error } = await supabase
        .from('diagnostic_logs')
        .select('created_at, cpu_load')
        .eq('user_id', session.user.id) // Filter by user!
        .order('created_at', { ascending: true })
        .limit(7);

    if (error) return [];


    // Map to simple array for the graph if needed, or return as is
    return data;
}

export async function performDailyCheckin(score: number) {
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) return { success: false, error: "Not authenticated" };

    const checkinData = {
        user_id: session.user.id,
        mood_score: score,
        created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from('daily_checkins')
        .insert([checkinData])
        .select();

    if (error) {
        console.error('Error saving daily checkin:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

export async function getTodaysCheckinStatus() {
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) return { hasCheckedIn: false };

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const { count, error } = await supabase
        .from('daily_checkins')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .gte('created_at', startOfDay.toISOString());

    if (error) {
        console.error("Error checking status", error);
        return { hasCheckedIn: false };
    }

    return { hasCheckedIn: (count || 0) > 0 };
}

export async function getUserStreak() {
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) return 0;

    // Get all unique dates from both logs and checkins
    // Note: In a real high-scale app, we would maintain a 'streak' counter in a users_stats table
    // For now, we will calculate it dynamically from the daily_checkins table and diagnostic_logs

    // We will use a simplified approach: Query last 30 days of checkins/logs and calculate streak js-side
    // Combine both tables dates

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // Get checks
    const { data: checkins } = await supabase
        .from('daily_checkins')
        .select('created_at')
        .eq('user_id', session.user.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

    // Get logs
    const { data: logs } = await supabase
        .from('diagnostic_logs')
        .select('created_at')
        .eq('user_id', session.user.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

    const allDates = [
        ...(checkins || []).map((c: any) => c.created_at),
        ...(logs || []).map((l: any) => l.created_at)
    ];

    if (allDates.length === 0) return 0;

    // Sort descending
    allDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    // Calculate streak
    let streak = 0;
    let lastDate = new Date();
    lastDate.setHours(0, 0, 0, 0); // Normalize to midnight today

    // Check if we have activity today
    const latestActivity = new Date(allDates[0]);
    latestActivity.setHours(0, 0, 0, 0);

    // If last activity was before yesterday, streak is broken (unless it's 0)
    // Actually, simple logic:
    // Create a set of "active dates" strings YYYY-MM-DD
    const activeDays = new Set<string>();
    allDates.forEach(d => {
        activeDays.add(new Date(d).toISOString().split('T')[0]);
    });

    const todayStr = new Date().toISOString().split('T')[0];

    // Check consecutive days backwards
    let currentCheck = new Date();
    while (true) {
        const checkStr = currentCheck.toISOString().split('T')[0];
        if (activeDays.has(checkStr)) {
            streak++;
            currentCheck.setDate(currentCheck.getDate() - 1);
        } else {
            // Allow missing today if it's still today
            if (checkStr === todayStr) {
                currentCheck.setDate(currentCheck.getDate() - 1);
                continue;
            }
            break;
        }
    }

    return streak;
}

// ========== Daily Habits Feature ==========

// Habits data with difficulty levels and bonus effects
// CPU decrease is good (less stress), Battery/Stability increase is good
// Note: Not exported because 'use server' files can only export async functions
const HABITS_DATA = [
    { id: 'morning_sun', difficulty: 1, cpuBonus: 5, batteryBonus: 10, stabilityBonus: 5 },
    { id: 'walk', difficulty: 1, cpuBonus: 5, batteryBonus: 10, stabilityBonus: 10 },
    { id: 'workout', difficulty: 3, cpuBonus: 10, batteryBonus: 15, stabilityBonus: 5 },
    { id: 'meditation', difficulty: 2, cpuBonus: 15, batteryBonus: 5, stabilityBonus: 15 },
    { id: 'sauna', difficulty: 3, cpuBonus: 10, batteryBonus: 10, stabilityBonus: 10 },
    { id: 'massage', difficulty: 4, cpuBonus: 5, batteryBonus: 15, stabilityBonus: 10 },
    { id: 'digital_detox', difficulty: 2, cpuBonus: 10, batteryBonus: 5, stabilityBonus: 10 },
    { id: 'sleep', difficulty: 1, cpuBonus: 15, batteryBonus: 20, stabilityBonus: 15 },
];

export async function completeHabit(habitId: string) {
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) {
        return { success: false, error: "Not authenticated" };
    }

    const startOfDay = getJSTStartOfDay();

    const { data: existing } = await supabase
        .from('habit_completions')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('habit_id', habitId)
        .gte('created_at', startOfDay.toISOString())
        .limit(1);

    if (existing && existing.length > 0) {
        return { success: false, error: "Already completed today" };
    }

    // Insert completion
    const { data, error } = await supabase
        .from('habit_completions')
        .insert([{
            user_id: session.user.id,
            habit_id: habitId,
            created_at: new Date().toISOString(),
        }])
        .select();

    if (error) {
        console.error('Error completing habit:', error);
        return { success: false, error: error.message };
    }

    // Get habit data for bonus calculation
    const habit = HABITS_DATA.find(h => h.id === habitId);
    if (!habit) {
        return { success: true, data: data[0], bonus: null };
    }

    return {
        success: true,
        data: data[0],
        bonus: {
            cpuBonus: habit.cpuBonus,
            batteryBonus: habit.batteryBonus,
            stabilityBonus: habit.stabilityBonus,
        }
    };
}

export async function uncompleteHabit(habitId: string) {
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) {
        return { success: false, error: "Not authenticated" };
    }

    const startOfDay = getJSTStartOfDay();

    const { error } = await supabase
        .from('habit_completions')
        .delete()
        .eq('user_id', session.user.id)
        .eq('habit_id', habitId)
        .gte('created_at', startOfDay.toISOString());

    if (error) {
        console.error('Error uncompleting habit:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function getTodaysCompletedHabits() {
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) return [];

    const startOfDay = getJSTStartOfDay();

    const { data, error } = await supabase
        .from('habit_completions')
        .select('habit_id')
        .eq('user_id', session.user.id)
        .gte('created_at', startOfDay.toISOString());

    if (error) {
        console.error('Error fetching completed habits:', error);
        return [];
    }

    return data.map((d: any) => d.habit_id);
}

// Helper to get Start of Day in JST (UTC+9)
function getJSTStartOfDay(): Date {
    const now = new Date();
    // 1. Get current UTC time
    const utcTime = now.getTime();
    // 2. Add 9 hours to get "JST Time" as absolute milliseconds
    const jstOffset = 9 * 60 * 60 * 1000;
    const jstDate = new Date(utcTime + jstOffset);
    // 3. Set hours to 0,0,0,0
    jstDate.setUTCHours(0, 0, 0, 0);
    // 4. Subtract 9 hours to get back to UTC timestamp for that JST midnight
    const result = new Date(jstDate.getTime() - jstOffset);
    return result;
}
