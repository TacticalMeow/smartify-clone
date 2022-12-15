import { Request, Response } from 'express';
import { USER_ID_COOKIE, DeleteJobRequest, DeleteJobResult } from '@smarter/shared';
import { logger } from 'logger';
import { JobModel } from 'models/job';
import { UserModel } from 'models/user';
import HttpStatus from 'http-status-codes';

const deleteJob = async (
  req: Request<object, object, DeleteJobRequest>,
  res: Response<DeleteJobResult>,
) => {
  const userId = req.cookies[USER_ID_COOKIE];
  const user = await UserModel.findById(userId);

  if (!user) {
    return res.status(HttpStatus.UNAUTHORIZED).send();
  }

  const { jobId } = req.body;
  try {
    if (jobId) {
      logger.debug(`deleting job for id: ${jobId}`);

      const job = await JobModel.findById(jobId);

      if (job?.user.toString() === userId as string) {
        await job.delete();
        return res.status(HttpStatus.OK).send({ result: true });
      }
    }

    return res.status(HttpStatus.BAD_REQUEST).send({ result: false, err: 'failed to delete job' });
  } catch (err :any) {
    logger.error(`failed to delete job for id: ${jobId}`);
    return res.status(HttpStatus.BAD_REQUEST).send({ result: false, err: 'failed to delete job' });
  }
};

export default deleteJob;
