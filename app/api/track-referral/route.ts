import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { referralCode, newUserId } = await request.json();

    if (!referralCode || !newUserId) {
      return NextResponse.json(
        { error: 'Missing referralCode or newUserId' },
        { status: 400 }
      );
    }

    // Extract referrer ID from referral code (format: userId-randomCode)
    const referrerId = referralCode.split('-')[0];

    // In a real application, you would:
    // 1. Save the referral relationship to your database
    // 2. Award points to both the referrer and the new user
    // 3. Track analytics and referral statistics
    
    console.log('Referral tracked:', {
      referrerId,
      newUserId,
      referralCode,
      timestamp: new Date().toISOString()
    });

    // Mock response - in production this would be real data
    return NextResponse.json({
      success: true,
      referrer: {
        id: referrerId,
        pointsAwarded: 50
      },
      newUser: {
        id: newUserId,
        pointsAwarded: 25
      }
    });

  } catch (error) {
    console.error('Error tracking referral:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 