// file: /api/token.js
const axios = require('axios');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { uid, password } = req.query;
    
    if (!uid || !password) {
      return res.status(400).json({ error: 'Missing uid or password' });
    }

    // Garena OAuth Request
    const oauthUrl = 'https://100067.connect.garena.com/oauth/guest/token/grant';
    const params = new URLSearchParams({
      uid: uid.toString(),
      password: password.toString(),
      response_type: 'token',
      client_type: '2',
      client_secret: '2ee44819e9b4598845141067b281621874d0d5d7af9d8f7e00c1e54715b7d1e3',
      client_id: '100067'
    });

    const response = await axios.post(oauthUrl, params.toString(), {
      headers: {
        'User-Agent': 'GarenaMSDK/4.0.19P9(SM-M526B ;Android 13;pt;BR;)',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 8000
    });

    if (response.data.access_token) {
      return res.json({
        token: response.data.access_token,
        open_id: response.data.open_id,
        success: true
      });
    } else {
      // Return mock token if no access_token
      return res.json({
        token: `eyJ${Date.now()}.mock_token`,
        note: 'Mock token returned',
        success: false
      });
    }
  } catch (error) {
    console.error('API Error:', error.message);
    
    // Always return a token to keep main script running
    return res.json({
      token: `eyJ${Date.now()}.error_fallback`,
      error: error.message,
      note: 'Fallback token due to error'
    });
  }
};
