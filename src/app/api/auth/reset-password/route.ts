// Hello Khata OS - Reset Password API
// Verifies OTP and resets the password (mock/local database implementation)

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, otp, password } = body;

    if (!phone || !otp || !password) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Phone, OTP, and new password are required',
          messageBn: 'ফোন, OTP এবং নতুন পাসওয়ার্ড প্রয়োজন',
        },
      }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'PASSWORD_TOO_SHORT',
          message: 'Password must be at least 8 characters long',
          messageBn: 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে',
        },
      }, { status: 400 });
    }

    // Find valid OTP record
    const otpRecord = await db.otp.findFirst({
      where: {
        phone,
        code: otp,
        purpose: 'reset_password',
        verified: true,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otpRecord) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_OTP',
          message: 'Invalid or expired reset code',
          messageBn: 'ভুল বা মেয়াদোত্তীর্ণ রিসেট কোড',
        },
      }, { status: 400 });
    }

    // Mark OTP as verified
    await db.otp.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    // Check if user exists
    const user = await db.user.findFirst({
      where: { phone },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          messageBn: 'ব্যবহারকারী পাওয়া যায়নি',
        },
      }, { status: 404 });
    }

    // Note: The SQLite schema does not store password field.
    // In production this would update the hashed password.
    // For local mockup/testing, verifying OTP is sufficient.

    return NextResponse.json({
      success: true,
      data: {
        message: 'Password reset successfully',
        messageBn: 'পাসওয়ার্ড সফলভাবে রিসেট করা হয়েছে',
      },
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to reset password',
        messageBn: 'পাসওয়ার্ড রিসেট করতে ব্যর্থ হয়েছে',
      },
    }, { status: 500 });
  }
}
