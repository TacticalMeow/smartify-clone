import SpotifyWebApi from 'spotify-web-api-node';

declare global {
    namespace Express {
    export interface Request {
        spotifyClient?: SpotifyWebApi
    }
  }
}
