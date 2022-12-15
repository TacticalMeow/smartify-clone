import { Request, Response } from 'express';
import { TestJobResult, TestJobRequest, USER_ID_COOKIE } from '@smarter/shared';
import { logger } from 'logger';
import { UserModel } from 'models/user';
import { Job } from 'logic/core/job';
import HttpStatus from 'http-status-codes';
import { ProcessorError } from 'logic/processors/processorError';
import { SpotifyClient } from 'services/spotifyClient';
import { SPOTIFY_CREDENTIALS } from 'env';

const testJob = async (
  req: Request<object, object, TestJobRequest>,
  res: Response<TestJobResult>,
) => {
  const { id, flow } = req.body;

  const userId = req.cookies[USER_ID_COOKIE];
  const user = await UserModel.findById(userId);

  if (!user) {
    return res.status(HttpStatus.UNAUTHORIZED).send();
  }

  if (flow.nodes.length >= user.config.maximumProcessorPerJob) {
    logger.warn(`cannot save job: ${id}, maximum processor allowed id: ${user.config.maximumProcessorPerJob}, current: ${flow.nodes.length}`);

    return res.status(HttpStatus.BAD_REQUEST).send();
  }

  // we are creating new instance of SpotifyClient and not using req.spotifyClient because
  // we want to be sure the token won't expire in the middle of the process

  const spotifyClient = new SpotifyClient(SPOTIFY_CREDENTIALS);
  spotifyClient.setRefreshToken(user.refreshToken);
  const tokens = await spotifyClient.refreshAccessToken();
  if (tokens) {
    spotifyClient.setAccessToken(tokens.body.access_token);
  } else {
    return res.status(HttpStatus.UNAUTHORIZED).send();
  }

  const resources = {
    user,
    spotifyClient,
    options: {
      isTest: false,
    },
  };

  try {
    const job = new Job(id, flow, resources);

    const results = await job.run();

    return res.status(HttpStatus.OK).send({ results });
  } catch (err: any) {
    if (err instanceof ProcessorError) {
      err.log();

      return res.status(err.statusCode || HttpStatus.BAD_REQUEST).send({
        results: [],
        errors: [{
          processorName: err.processorConfig.displayName,
          message: err.message,
        }],
      });
    }

    logger.error(`unexpected error. ${err.stack}`);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      results: [],
      errors: [{
        message: 'Internal Server Error.',
      }],
    });
  }
};

export default testJob;
