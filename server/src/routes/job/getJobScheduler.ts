import { Request, Response } from 'express';
import { GetJobSchedulerRequest, GetJobScheduler, USER_ID_COOKIE } from '@smarter/shared';
import { logger } from 'logger';
import HttpStatus from 'http-status-codes';
import { agenda, SET_JOB_SCHEDULER } from 'services/scheduler';

const getJobScheduler = async (
  req: Request<GetJobSchedulerRequest, object, object>,
  res: Response<GetJobScheduler>,
) => {
  const {
    jobId,
  } = req.query;
  logger.debug(`getting job scheduler for id ${jobId}`);

  const userId = req.cookies[USER_ID_COOKIE];

  try {
    const scheduler = await agenda._collection.findOne({
      name: SET_JOB_SCHEDULER,
      data: { jobId, userId },
    });

    if (!scheduler) {
      return res.status(HttpStatus.OK).send({
        nextRun: null,
        endDate: null,
        interval: null,
      });
    }

    return res.status(HttpStatus.OK).send({
      nextRun: scheduler.nextRunAt,
      endDate: scheduler.endDate,
      interval: scheduler.repeatInterval,
    });
  } catch (err: any) {
    logger.error(`failed to get scheduler for job ${jobId}. ${err.stack}`);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
  }
};

export default getJobScheduler;
