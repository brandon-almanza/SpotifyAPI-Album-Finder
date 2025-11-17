export default async function handler(req, res) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Missing Spotify credentials on server' });
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const data = await tokenRes.json();
    if (!tokenRes.ok) return res.status(tokenRes.status).json(data);

    // Return token payload (access_token, expires_in, etc.)
    return res.status(200).json(data);
  } catch (err) {
    console.error('Token endpoint error', err);
    return res.status(500).json({ error: 'Failed to fetch token' });
  }
}
