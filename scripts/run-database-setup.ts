#!/usr/bin/env node
import { setupDatabase } from './setup-database'

async function main() {
  try {
    console.log('Running database setup...')
    const result = await setupDatabase()
    
    if (result.success) {
      console.log('Database setup completed successfully!')
      process.exit(0)
    } else {
      console.error('Database setup failed:', result.error)
      process.exit(1)
    }
  } catch (error) {
    console.error('Unexpected error during database setup:', error)
    process.exit(1)
  }
}

main() 