import { Request, Response } from 'express';
import { GetJob, GetJobRequest } from '@smarter/shared';
import { logger } from 'logger';
import { JobModel } from 'models/job';
import HttpStatus from 'http-status-codes';

const getJob = async (
  req: Request<object, object, GetJobRequest>,
  res: Response<GetJob>,
) => {
  const { jobId } = req.query;

  try {
    if (jobId) {
      const job = await JobModel.findById(jobId);
      if (job) {
        return res.status(HttpStatus.OK).json(job);
      }

      return res.status(HttpStatus.BAD_REQUEST).send();
    }
  } catch (err: any) {
    logger.error(`failed to get job: ${err.stack}`);
  }

  return res.status(HttpStatus.UNAUTHORIZED).send();
};

export default getJob;
