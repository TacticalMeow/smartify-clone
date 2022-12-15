/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-var-requires
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

import express from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import {
  CLIENT_DOMAIN,
  MONGO_CONNECTION_STRING,
  IS_PROD,
  CORS_DOMAIN,
} from 'env';
import { authRouter } from 'routes/auth';
import cors from 'cors';
import { logger } from 'logger';
import addSpotifyClient from 'middleware/authorize';
import cookieParser from 'cookie-parser';
import { jobRouter } from 'routes/job';
import csrf from 'csurf';
import { agenda } from 'services/scheduler';
import { CSRF_COOKIE, Endpoints } from '@smarter/shared';

const PORT = process.env.NODE_DOCKER_PORT || 8000;
const app = express();

app.use(cors({ credentials: true, origin: CORS_DOMAIN }));
app.options(CORS_DOMAIN, (req, res) => {
  res.status(200).send();
});
app.use(cookieParser());
app.use(json());

const csrfProtection = csrf({
  cookie: {
    key: CSRF_COOKIE,
    httpOnly: true,
    sameSite: 'none',
    domain: IS_PROD ? CLIENT_DOMAIN : undefined,
    secure: true,
  },
});

app.use(csrfProtection);

app.get('/', (req, res) => { res.status(200).send('Ok'); });

app.get(Endpoints.getCsrf, (req, res) => {
  const token = req.csrfToken();

  return res.status(200).json({
    csrfToken: token,
  });
});

app.use(addSpotifyClient);

// Routers
app.use(authRouter);
app.use(jobRouter);

mongoose.connect(MONGO_CONNECTION_STRING, {
  autoIndex: true,
  autoCreate: true,
}, (err: any) => {
  if (!err) {
    logger.info('connected to database');
  } else {
    logger.error(err.stack);
  }
});

app.listen(PORT, () => {
  logger.info(`server is listening on port ${PORT}`);
});

(async function () {
  await agenda.start();
}());
