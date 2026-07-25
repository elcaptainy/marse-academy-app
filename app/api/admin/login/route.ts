import { NextRequest, NextResponse } from 'next/server';
import { generateToken, verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Strict credential configuration check
    if (!adminEmail || !adminPassword) {
      console.error('❌ Security Error: ADMIN_EMAIL or ADMIN_PASSWORD not configured in environment.');
      return NextResponse.json(
        { success: false, error: 'Authentication service misconfigured. Contact system administrator.' }, 
        { status: 500 }
      );
    }

    if (email === adminEmail && password === adminPassword) {
      const token = generateToken(email);
      const response = NextResponse.json({ success: true, message: 'Authenticated successfully' });
      
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      return response;
    }

    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (verifyToken(token)) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
