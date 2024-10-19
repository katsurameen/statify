import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

export const GET = withApiAuthRequired(async (req) => {
  try {
    // Fetch the access token from your custom token endpoint
    const clientId = process.env.SPOTIFY_CLIENT_ID; // Your client ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET; // Your client secret
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
        },
        body: new URLSearchParams({
          'grant_type': 'client_credentials',
        }),
      });

      const tokenData = await response.json();
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(data.error_description || 'Failed to fetch access token');
      }
  

    const accessToken = tokenData.access_token; // Extract access token from response

    console.log(accessToken)
    // Fetch top artists
    const topArtistsRes = await fetch('https://api.spotify.com/v1/me/top/artists?limit=3', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Fetch top tracks
    const topTracksRes = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=4', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const artists = await topArtistsRes.json();
    const tracks = await topTracksRes.json();

    // Return the response
    return new Response(JSON.stringify({ artists, tracks }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching Spotify data:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
