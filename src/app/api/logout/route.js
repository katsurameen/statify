// src/app/api/logout/route.js

import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear cookies or authentication tokens (JWT, session, etc.)
    const response = NextResponse.json({ message: 'Logged out successfully' });

    // If you're using cookies for authentication
    response.cookies.set('access_token', '', { maxAge: 0 });
    response.cookies.set('refresh_token', '', { maxAge: 0 });

    // Redirect to login page or homepage
    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json({ message: 'Logout failed', error }, { status: 500 });
  }
}
