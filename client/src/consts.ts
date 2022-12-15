const BASE_URL = process.env.REACT_APP_SERVER_URI || 'http://localhost:8000';
const authEndpoint = 'https://accounts.spotify.com/authorize';
const redirectUri = process.env.REACT_APP_REDIRECT_URI || 'http://localhost:3000/callback';
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID || '65c27994ebd343fba94146f790040ccc';
const STATE = 'state';

export {
  authEndpoint, redirectUri, clientId, BASE_URL, STATE,
};
