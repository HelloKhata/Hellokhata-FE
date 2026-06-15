// Hello Khata OS - Forgot Password API
// Sends OTP for password recovery if user exists

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const STATIC_OTP = '123456';
const OTP_EXPIRY_MINUTES = 5;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone || !/^01[3-9]\d{8}$/.test(phone)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_PHONE',
          message: 'Please enter a valid Bangladeshi phone number',
          messageBn: 'সঠিক বাংলাদেশি ফোন নম্বর দিন',
        },
      }, { status: 400 });
    }

    // Check if user exists
    const user = await db.user.findFirst({
      where: { phone },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'This phone number is not registered',
          messageBn: 'এই ফোন নম্বরটি নিবন্ধিত নয়',
        },
      }, { status: 404 });
    }

    // Delete existing OTPs for this phone with reset_password purpose
    await db.otp.deleteMany({
      where: {
        phone,
        purpose: 'reset_password',
        verified: false,
      },
    });

    // Create new OTP for reset password
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await db.otp.create({
      data: {
        phone,
        code: STATIC_OTP,
        purpose: 'reset_password',
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        message: 'Reset code sent successfully',
        messageBn: 'রিসেট কোড সফলভাবে পাঠানো হয়েছে',
        ...(process.env.NODE_ENV !== 'production' && { otp: STATIC_OTP }),
      },
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to process forgot password request',
        messageBn: 'অনুরোধটি প্রক্রিয়া করতে ব্যর্থ হয়েছে',
      },
    }, { status: 500 });
  }
}
