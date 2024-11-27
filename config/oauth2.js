const { google } = require('googleapis');

// Load client credentials from Google Developer Console
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,     // Client ID from your JSON file
  process.env.CLIENT_SECRET, // Client Secret from your JSON file
  process.env.REDIRECT_URI   // Redirect URI (use http://localhost for dev)
);

// Generate a refresh token manually and set it in `.env`
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

module.exports = oAuth2Client;
