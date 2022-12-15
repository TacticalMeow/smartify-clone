import {
  MAXIMUM_JOBS_FOR_USER,
  MAXIMUM_PROCESSORS_FOR_JOB,
  SPOTIFY_CREDENTIALS,
} from 'env';
import express, { Request, Response } from 'express';
import { logger } from 'logger';
import SpotifyClient from 'spotify-web-api-node';
import { UserModel } from 'models/user';
import {
  CSRF_COOKIE, Endpoints, REFRESH_TOKEN_COOKIE, User, USER_ID_COOKIE,
} from '@smarter/shared';
import moment from 'moment';
import HttpStatus from 'http-status-codes';

const router = express.Router();

router.get(Endpoints.login, async (req: Request, res: Response) => {
  const spotifyApi = new SpotifyClient(SPOTIFY_CREDENTIALS);

  const { code } = req.query;

  try {
    const response = await spotifyApi.authorizationCodeGrant(code as string);

    spotifyApi.setAccessToken(response.body.access_token);
    const { body: userData } = await spotifyApi.getMe();

    let user = await UserModel.findOne({ spotifyId: userData.id });

    if (!user) {
      logger.info(`creating new user ${userData.id}`);
      try {
        user = await UserModel.create({
          name: userData.display_name,
          spotifyId: userData.id,
          refreshToken: response.body.refresh_token,
          config: {
            maximumJobs: MAXIMUM_JOBS_FOR_USER,
            maximumProcessorPerJob: MAXIMUM_PROCESSORS_FOR_JOB,
          },
        } as User);
      } catch (err: any) {
        logger.error(`failed to insert user to database: ${err.stack}`);

        return res.status(503).send();
      }
    } else {
      user.refreshToken = response.body.refresh_token;
      await user.save();
    }

    res.cookie(REFRESH_TOKEN_COOKIE, response.body.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: moment('9999-05-05').toDate(),
    });

    res.cookie(USER_ID_COOKIE, user?.id, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: moment('9999-05-05').toDate(),
    });

    res.json({
      accessToken: response.body.access_token,
      expiresIn: response.body.expires_in,
      config: user?.config,
    });

    return res.status(HttpStatus.ACCEPTED).send();
  } catch (err: any) {
    logger.error(err.stack);
    return res.sendStatus(400);
  }
});

router.get(Endpoints.refreshAccessToken, async (req: Request, res: Response) => {
  const spotifyApi = new SpotifyClient(SPOTIFY_CREDENTIALS);

  try {
    spotifyApi.setRefreshToken(req.cookies[REFRESH_TOKEN_COOKIE]);

    const response = await spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(response.body.access_token);

    const { body: userData } = await spotifyApi.getMe();

    const user = await UserModel.findOne({ spotifyId: userData.id });

    res.cookie(USER_ID_COOKIE, user?.id, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.json({
      accessToken: response.body.access_token,
      expiresIn: response.body.expires_in,
      config: user?.config,
    });

    logger.info(`refreshed access token for user ${user?.id}`);
    return res.status(HttpStatus.ACCEPTED).send();
  } catch (err: any) {
    logger.error(err.stack);

    return res.sendStatus(400);
  }
});

router.get(Endpoints.logout, async (req: Request, res: Response) => {
  res.clearCookie(REFRESH_TOKEN_COOKIE);
  res.clearCookie(USER_ID_COOKIE);
  res.clearCookie(CSRF_COOKIE);

  res.status(200).json({ message: 'ok' });
});

export { router as authRouter, REFRESH_TOKEN_COOKIE };
