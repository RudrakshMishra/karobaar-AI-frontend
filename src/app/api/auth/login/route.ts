import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    // In production, verify against PostgreSQL/MongoDB here
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Mock JWT token approach
    const mockJwtTokens = "eyJhbGciOiJIUzI1NiIsInR5cCI... (mocked)";
    
    const response = NextResponse.json({ success: true, message: 'Logged in successfully' });
    
    // Set cookie
    response.cookies.set({
      name: 'karobaar_session',
      value: mockJwtTokens,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
