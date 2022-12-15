import { Agenda } from 'agenda';
import { MONGO_CONNECTION_STRING, SPOTIFY_CREDENTIALS } from 'env';
import { logger } from 'logger';
import { Job } from 'logic/core/job';
import { ProcessorError } from 'logic/processors/processorError';
import { JobModel } from 'models/job';
import { UserModel } from 'models/user';
import moment from 'moment';
import { SpotifyClient } from 'services/spotifyClient';

export const agenda = new Agenda({ db: { address: MONGO_CONNECTION_STRING, collection: 'schedules' } });

export const SET_JOB_SCHEDULER = 'set-job-scheduler';

agenda.define(SET_JOB_SCHEDULER, async (task, done) => {
  const userId = task?.attrs?.data?.userId;
  const jobId = task?.attrs?.data?.jobId;

  logger.info(`running scheduled job. jobId:${jobId}, schedulerId:${task.attrs._id}`);

  if (!userId || !jobId) {
    logger.error('userId and jobId cannot be undefined');
    done();

    return;
  }

  const user = await UserModel.findById(userId);

  if (!user) {
    logger.error(`user ${userId} does not exist`);
    done();

    return;
  }

  const spotifyClient = new SpotifyClient(SPOTIFY_CREDENTIALS);
  spotifyClient.setRefreshToken(user.refreshToken);
  const tokens = await spotifyClient.refreshAccessToken();
  if (tokens) {
    spotifyClient.setAccessToken(tokens.body.access_token);
  } else {
    logger.error(`failed to get access token from spotify api. jobId: ${jobId}`);
  }

  const job = await JobModel.findById(jobId);

  if (!job) {
    logger.error(`job ${jobId} does not exist`);
    done();

    return;
  }

  const resources = {
    user,
    spotifyClient,
    options: {
      isTest: false,
    },
  };
  try {
    const results = await (new Job(job._id, job.flow, resources)).run();

    job.history.push({
      results,
      lastRunAt: moment().toDate(),
    });

    await job.save();
  } catch (err: any) {
    if (err instanceof ProcessorError) {
      err.log();
    }

    logger.error(`unexpected error. ${err.stack}`);
  }

  logger.info(`the job was completed successfully. jobId:${jobId}, schedulerId:${task.attrs._id}`);
  done();
});
