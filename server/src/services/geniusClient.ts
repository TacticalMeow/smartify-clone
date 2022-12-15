import { GENIUS_CLIENT_API_KEY } from 'env';
import { Client } from 'genius-lyrics';

export const lyricsClient = new Client(GENIUS_CLIENT_API_KEY);
