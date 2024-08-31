const {google} = require('googleapis');
const fs = require('fs');
const { default: axios } = require('axios');

const CLIENT_ID="469079965579-l704roh952cnfdkok2t1qcm4ue6bcug9.apps.googleusercontent.com"
const CLIENT_SECRET="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"
const REDIRECT_URL="http://localhost:3000/api/google/callback"
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
"https://www.googleapis.com/auth/drive",
"https://www.googleapis.com/auth/drive.file",
"https://www.googleapis.com/auth/userinfo.profile",
"https://www.googleapis.com/auth/userinfo.email"
]

const generateAuthUrl = ({userId}) => {
const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes,
  state:`userId=${userId}`
});
return url
}
const getToken = async (code) => {
  const {tokens} = await oauth2Client.getToken(code)
  return tokens
}
const setCredentials = (tokens) => {
  oauth2Client.setCredentials( tokens);
}
const driveUpload = async (token,stream) => {
    setCredentials(token)
    const drive = google.drive({
      version:'v3',
      auth:oauth2Client
    })
    let body;
    if(typeof stream==='string'){
      const response = await axios({
        method: 'GET',
        url: stream,
        responseType: 'stream',
      });
      body=response?.data
    }else{
      body=stream
    }
    const res = await drive.files.create({
    requestBody: {
      name: `image-${Date.now()}.png`,
      mimeType: 'image/png',
      // parents:["1I7B7wzoGYwbiTKhmSNnsX3ywmznuf1co"]
    },
    media: {
      mimeType: 'image/png',
      body
    }
  });
  console.log(res.data);

}
module.exports={generateAuthUrl, getToken, setCredentials, driveUpload}
