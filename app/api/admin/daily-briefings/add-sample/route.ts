import { NextResponse } from 'next/server'
import { addSampleBriefing } from '@/lib/daily-briefing-setup-server'

export async function POST() {
  const result = await addSampleBriefing()
  return NextResponse.json(result)
} 