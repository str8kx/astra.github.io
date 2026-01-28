const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

const CLIENT_ID = '1449204873806745610';
const CLIENT_SECRET = 'kV07pomaGP96p4QkkVs5bpLsnpekKXke';
const REDIRECT_URI = 'https://astra.pages.dev/servers'; // Public URL

app.use(cors());

app.get('/servers', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Missing code');

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Fetch user guilds
    const guildRes = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const guilds = await guildRes.json();

    // Render basic dashboard
    res.send(`
      <h1>Your Servers</h1>
      <ul>
        ${guilds.map(g => `<li>${g.name}</li>`).join('')}
      </ul>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('OAuth failed');
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
