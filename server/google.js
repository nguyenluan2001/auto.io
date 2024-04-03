const {google} = require('googleapis');

const CLIENT_ID="469079965579-l704roh952cnfdkok2t1qcm4ue6bcug9.apps.googleusercontent.com"
const CLIENT_SECRET="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"
const REDIRECT_URL="http://localhost:3000/api/google/callback"
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = "https://www.googleapis.com/auth/drive" 

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes
});
console.log("🚀 ===== url:", url);
