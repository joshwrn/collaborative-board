import { google } from 'googleapis'

// Set your credentials and scopes
const CLIENT_ID = 'YOUR_CLIENT_ID'
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET'
const REDIRECT_URI = 'http://localhost:3000'
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'] // Specify required scopes

// Create OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
)

// Generate auth URL
export const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
})
