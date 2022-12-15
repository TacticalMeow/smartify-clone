import { Endpoints, USER_ID_COOKIE } from '@smarter/shared';
import { SPOTIFY_CREDENTIALS } from 'env';
import { Request, Response } from 'express';
import { REFRESH_TOKEN_COOKIE } from 'routes/auth';
import { SpotifyClient } from 'services/spotifyClient';

const NON_SECURE_PATHS = [Endpoints.getCsrf, Endpoints.login, Endpoints.refreshAccessToken];

export default function (req: Request, res: Response, next: any) {
  if (NON_SECURE_PATHS.includes(req.path as unknown as Endpoints)) {
    return next();
  }

  const { authorization } = req.headers;
  const userId = req.cookies[USER_ID_COOKIE];

  if (authorization && userId) {
    const spotifyClient = new SpotifyClient(SPOTIFY_CREDENTIALS);

    spotifyClient.setAccessToken(authorization.replace('Bearer ', ''));
    spotifyClient.setRefreshToken(req.cookies[REFRESH_TOKEN_COOKIE]);

    req.spotifyClient = spotifyClient;

    return next();
  }

  return res.status(401).send();
}
