const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manual .env.local parsing
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
            if (key && val) {
                process.env[key] = val;
            }
        }
    });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log("Reading schema file...");
    const schemaPath = path.join(__dirname, 'supabase_habits_schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    // Supabase JS client doesn't support running raw SQL directly via standard client easily usually
    // unless using rpc if available, or if these are just data operations.
    // However, create table (DDL) usually requires direct SQL access or Dashboard.

    // WAIT. If I cannot run DDL via JS Client (standard), then I cannot apply schema this way.
    // Actually, `supabase-js` DOES NOT support running raw SQL unless you have a stored procedure `exec_sql`.

    // Strategy Change:
    // I cannot apply DDL via `supabase-js` client without a helper function on the server.
    // Since `psql` failed, and I can't browse the Supabase Dashboard...
    // I should ask the user to run the SQL or provide a way.

    // BUT! I can check if the table exists first. If it works, maybe it's already there?
    // Let's try to select from it.

    console.log("Checking if table exists...");
    const { error } = await supabase.from('habit_completions').select('count', { count: 'exact', head: true });

    if (error) {
        console.error("Table access failed or doesn't exist:", error.message);
        console.log("\n!!! CRITICAL: You need to apply the schema manually in Supabase SQL Editor. !!!\n");
        console.log("SQL File: " + schemaPath);
    } else {
        console.log("Table 'habit_completions' exists and is accessible.");
    }
}

run();
