// src/app/api/callback/route.js
import { NextResponse } from 'next/server';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.NODE_ENV === 'production'
  ? 'https://your-vercel-app.vercel.app/api/callback' // Replace with your Vercel app URL
  : 'http://localhost:3000/api/callback'; // Local development URL

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code) {
    console.error('Authorization code missing');
    return new Response('Authorization code missing', { status: 400 });
  }

  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri, // Use the dynamic redirect_uri
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log('Token data:', tokenData);

    if (!tokenResponse.ok) {
      throw new Error(`Failed to get tokens: ${tokenData.error_description}`);
    }

    const { access_token, refresh_token } = tokenData;

    const redirectUrl = new URL('/dashboard', req.url);
    redirectUrl.searchParams.set('access_token', access_token);
    redirectUrl.searchParams.set('refresh_token', refresh_token);

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return new Response('Error during token exchange', { status: 500 });
  }
}
