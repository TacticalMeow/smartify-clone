import { Request, Response } from 'express';
import { SetJobSchedulerRequest, USER_ID_COOKIE } from '@smarter/shared';
import { logger } from 'logger';
import HttpStatus from 'http-status-codes';
import { agenda, SET_JOB_SCHEDULER } from 'services/scheduler';
import moment from 'moment';

const setJobScheduler = async (
  req: Request<object, object, SetJobSchedulerRequest>,
  res: Response,
) => {
  const {
    jobId, interval, startDate, endDate, timezone,
  } = req.body;

  const userId = req.cookies[USER_ID_COOKIE];

  try {
    await agenda._collection.deleteMany({
      name: SET_JOB_SCHEDULER,
      data: { jobId, userId },
    });

    if (!interval) {
      logger.info(`removing job scheduler for id ${jobId}`);

      return res.status(HttpStatus.OK).send();
    }

    logger.info(`set job scheduler for id ${jobId} and interval ${interval} starting from ${startDate}`);

    const scheduler = agenda.create(SET_JOB_SCHEDULER, { jobId, userId });
    scheduler.repeatEvery(interval, {
      startDate: moment(startDate).toDate(),
      endDate: moment(endDate).toDate(),
      timezone,
    });

    await scheduler.save();

    logger.info(`done setting scheduler for id ${jobId}`);

    return res.status(HttpStatus.OK).send();
  } catch (err: any) {
    logger.error(`failed to create scheduler for job ${jobId}. ${err.stack}`);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
  }
};

export default setJobScheduler;
