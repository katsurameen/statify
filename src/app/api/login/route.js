// src/app/api/login/route.js
import { NextResponse } from 'next/server';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
const scope = 'user-top-read'; // Request access to user's top items

export async function GET() {
  const state = Math.random().toString(36).substring(7); // Random state to prevent CSRF attacks
  const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=${state}`;

  console.log('Redirecting to Spotify authorization URL:', authUrl);
  return NextResponse.redirect(authUrl);
}
