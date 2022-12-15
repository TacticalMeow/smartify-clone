import { Request, Response } from 'express';
import { GetMyJobs, USER_ID_COOKIE } from '@smarter/shared';
import { logger } from 'logger';
import { JobModel } from 'models/job';
import HttpStatus from 'http-status-codes';

const getMyJobs = async (
  req: Request<any>,
  res: Response<GetMyJobs>,
) => {
  const userId = req.cookies[USER_ID_COOKIE];

  try {
    const jobs = await JobModel.find({ user: userId });

    if (jobs) {
      return res.status(HttpStatus.OK).json(jobs);
    }

    return res.status(HttpStatus.BAD_REQUEST).send();
  } catch (err: any) {
    logger.error(`failed to get job: ${err.stack}`);
  }

  return res.status(HttpStatus.UNAUTHORIZED).send();
};

export default getMyJobs;
