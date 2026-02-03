const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load environment variables manually
const envPath = '.env.local';
if (!fs.existsSync(envPath)) {
    console.error('.env.local file not found');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        let value = match[2];
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
        }
        env[match[1].trim()] = value;
    }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable(tableName) {
    console.log(`Checking table: ${tableName}...`);
    const { data, error } = await supabase.from(tableName).select('*').limit(1);

    if (error) {
        console.error(`❌ Error accessing '${tableName}':`, error.message);
        return false;
    } else {
        console.log(`✅ Table '${tableName}' exists and is accessible.`);
        return true;
    }
}

async function checkWritePermission() {
    console.log(`Checking write permission on 'users' table...`);
    const testEmail = `test-write-${Date.now()}@example.com`;

    // Try to insert
    const { data, error: insertError } = await supabase.from('users').insert({
        email: testEmail,
        name: 'Test Write',
        image: 'https://example.com/test.png',
        emailVerified: new Date().toISOString()
    }).select().single();

    if (insertError) {
        console.error(`❌ Error inserting into 'users':`, insertError.message);
        return false;
    }

    console.log(`✅ Insert successful. ID: ${data.id}`);

    // Clean up
    const { error: deleteError } = await supabase.from('users').delete().eq('id', data.id);
    if (deleteError) {
        console.error(`⚠️ Warning: Could not delete test user:`, deleteError.message);
    } else {
        console.log(`✅ Cleanup (delete) successful.`);
    }

    return true;
}

async function main() {
    console.log('--- Starting System Check ---');
    console.log(`URL: ${supabaseUrl}`);

    const tables = ['users', 'accounts', 'sessions', 'verification_tokens'];
    let allGood = true;

    for (const table of tables) {
        const result = await checkTable(table);
        if (!result) allGood = false;
    }

    if (allGood) {
        const writeSuccess = await checkWritePermission();
        if (writeSuccess) {
            console.log('\nSUCCESS: All tables exist, accessible, and writable.');
        } else {
            console.log('\nFAILURE: Tables exist but WRITING failed.');
            allGood = false;
        }
    } else {
        console.log('\nFAILURE: Some tables are missing or inaccessible.');
        console.log('Please make sure you ran the SQL in Supabase SQL Editor.');
    }
}

main();
