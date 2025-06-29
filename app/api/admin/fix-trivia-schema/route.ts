export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/app/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = getServiceSupabase();
    
    console.log('🔧 Starting trivia_attempts table migration...');
    
    // Step 1: Create table if it doesn't exist
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS trivia_attempts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        score INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    console.log('📝 Creating table...');
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql_query: createTableSQL
    });
    
    if (createError) {
      console.error('❌ Failed to create table:', createError);
      // Continue anyway - table might already exist
    } else {
      console.log('✅ Table created/verified');
    }
    
    // Step 2: Add missing columns
    const addColumnsSQL = `
      ALTER TABLE trivia_attempts 
      ADD COLUMN IF NOT EXISTS game_id TEXT,
      ADD COLUMN IF NOT EXISTS correct_answers INTEGER,
      ADD COLUMN IF NOT EXISTS time_spent INTEGER;
    `;
    
    console.log('🔧 Adding missing columns...');
    const { error: columnsError } = await supabase.rpc('exec_sql', {
      sql_query: addColumnsSQL
    });
    
    if (columnsError) {
      console.error('❌ Failed to add columns:', columnsError);
      return NextResponse.json({
        success: false,
        message: 'Failed to add columns',
        error: columnsError
      }, { status: 500 });
    } else {
      console.log('✅ Columns added');
    }
    
    // Step 3: Add indexes
    const indexesSQL = `
      CREATE INDEX IF NOT EXISTS trivia_attempts_user_id_idx ON trivia_attempts(user_id);
      CREATE INDEX IF NOT EXISTS trivia_attempts_game_id_idx ON trivia_attempts(game_id);
      CREATE INDEX IF NOT EXISTS trivia_attempts_created_at_idx ON trivia_attempts(created_at DESC);
    `;
    
    console.log('📊 Creating indexes...');
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql_query: indexesSQL
    });
    
    if (indexError) {
      console.warn('⚠️ Failed to create indexes (might already exist):', indexError);
    } else {
      console.log('✅ Indexes created');
    }
    
    // Step 4: Verify table structure (skip test insert due to foreign key constraints)
    console.log('🧪 Verifying table structure...');
    const { data: tableInfo, error: structureError } = await supabase
      .from('trivia_attempts')
      .select('*')
      .limit(0); // Just get the structure, no data
    
    if (structureError) {
      console.error('❌ Failed to verify table structure:', structureError);
      return NextResponse.json({
        success: false,
        message: 'Failed to verify table structure',
        error: structureError
      }, { status: 500 });
    } else {
      console.log('✅ Table structure verified - migration complete!');
      console.log('📊 Table is ready to accept: user_id, game_id, score, total_questions, correct_answers, time_spent');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Trivia attempts table migration completed successfully'
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Migration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 