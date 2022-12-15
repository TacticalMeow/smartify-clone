const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '123456';
const DB_NAME = process.env.DB_NAME || 'mysmarterplaylists';
const DB_PORT = process.env.DB_PORT || 27017;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || 'client';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || 'secret';
const SPOTIFY_REDIRECT_URL = process.env.SPOTIFY_REDIRECT_URL || 'http://redirect';
const IS_PROD = process.env.NODE_ENV === 'production';
const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN || 'localhost';
const SPOTIFY_CREDENTIALS = {
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_CLIENT_SECRET,
  redirectUri: SPOTIFY_REDIRECT_URL,
};
const MONGO_CONNECTION_STRING = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;
const SPOTIFY_MAX_RETRY = process.env.SPOTIFY_MAX_RETRY || 20;
const GENIUS_CLIENT_API_KEY = process.env.GENIUS_CLIENT_API_KEY || 'client';
const CORS_DOMAIN = process.env.CORS_DOMAIN || 'http://localhost:3000';
const MAXIMUM_JOBS_FOR_USER = process.env.MAXIMUM_JOBS_FOR_USER || 5;
const MAXIMUM_PROCESSORS_FOR_JOB = process.env.MAXIMUM_PROCESSORS_FOR_JOB || 300;

export {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URL,
  SPOTIFY_CLIENT_SECRET,
  IS_PROD,
  CLIENT_DOMAIN,
  SPOTIFY_CREDENTIALS,
  MONGO_CONNECTION_STRING,
  SPOTIFY_MAX_RETRY,
  GENIUS_CLIENT_API_KEY,
  CORS_DOMAIN,
  MAXIMUM_JOBS_FOR_USER,
  MAXIMUM_PROCESSORS_FOR_JOB,
};
