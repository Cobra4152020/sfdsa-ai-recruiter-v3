import { createClient } from '@/lib/supabase-clients';
import { promises as fs } from 'fs';
import path from 'path';

async function applySecurityMeasures() {
  try {
    const supabase = createClient();

    console.log('Applying security measures...');

    // Read and execute migration files
    const migrationFiles = [
      'fix_security_issues.sql',
      'create_webauthn_tables.sql',
      'create_security_monitoring_tables.sql',
    ];

    for (const file of migrationFiles) {
      console.log(`\nApplying migration: ${file}`);
      const sql = await fs.readFile(
        path.join(process.cwd(), 'migrations', file),
        'utf8'
      );

      // Split SQL into individual statements
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      // Execute each statement
      for (const statement of statements) {
        try {
          const { error } = await supabase.rpc('exec_sql', {
            sql: statement,
          });

          if (error) {
            console.error(`Error executing statement: ${error.message}`);
            console.error('Statement:', statement);
          }
        } catch (err) {
          console.error('Failed to execute statement:', err);
          console.error('Statement:', statement);
        }
      }
    }

    console.log('\nVerifying security measures...');

    // Verify RLS is enabled on critical tables
    const tables = [
      'user_authenticators',
      'webauthn_challenges',
      'security_events',
      'security_alerts',
      'blocked_ips',
      'monitored_ips',
      'security_notifications',
      'security_review_queue',
    ];

    for (const table of tables) {
      const { data, error } = await supabase
        .from('pg_tables')
        .select('relrowsecurity')
        .eq('tablename', table)
        .single();

      if (error) {
        console.error(`Error checking RLS for ${table}:`, error.message);
      } else {
        console.log(`RLS enabled for ${table}: ${data.relrowsecurity ? 'Yes' : 'No'}`);
      }
    }

    // Verify indexes exist
    console.log('\nVerifying indexes...');
    const { data: indexes, error: indexError } = await supabase
      .from('pg_indexes')
      .select('tablename, indexname')
      .in('tablename', tables);

    if (indexError) {
      console.error('Error checking indexes:', indexError.message);
    } else {
      const indexesByTable = indexes.reduce((acc, idx) => {
        acc[idx.tablename] = acc[idx.tablename] || [];
        acc[idx.tablename].push(idx.indexname);
        return acc;
      }, {} as Record<string, string[]>);

      for (const table of tables) {
        console.log(`\nIndexes for ${table}:`);
        console.log(indexesByTable[table]?.join('\n') || 'No indexes found');
      }
    }

    // Verify security functions exist
    console.log('\nVerifying security functions...');
    const functions = [
      'cleanup_expired_challenges',
      'cleanup_old_security_data',
    ];

    for (const func of functions) {
      const { data, error } = await supabase
        .from('pg_proc')
        .select('proname')
        .eq('proname', func)
        .single();

      if (error) {
        console.error(`Error checking function ${func}:`, error.message);
      } else {
        console.log(`Function ${func} exists: ${data ? 'Yes' : 'No'}`);
      }
    }

    // Verify scheduled jobs
    if (process.env.ENABLE_CRON === 'true') {
      console.log('\nVerifying scheduled jobs...');
      const { data: jobs, error: jobError } = await supabase
        .from('cron.job')
        .select('jobname, schedule');

      if (jobError) {
        console.error('Error checking scheduled jobs:', jobError.message);
      } else {
        console.log('Scheduled jobs:');
        jobs?.forEach(job => {
          console.log(`${job.jobname}: ${job.schedule}`);
        });
      }
    }

    console.log('\nSecurity measures applied successfully!');
  } catch (error) {
    console.error('Failed to apply security measures:', error);
    process.exit(1);
  }
}

// Run the script
applySecurityMeasures(); 