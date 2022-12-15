import { Request, Response } from 'express';
import { USER_ID_COOKIE, RenameJobRequest, RenameJobResult } from '@smarter/shared';
import { logger } from 'logger';
import { JobModel } from 'models/job';
import { UserModel } from 'models/user';
import HttpStatus from 'http-status-codes';

const renameJob = async (
  req: Request<object, object, RenameJobRequest>,
  res: Response<RenameJobResult>,
) => {
  const userId = req.cookies[USER_ID_COOKIE];
  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(HttpStatus.UNAUTHORIZED).send();
  }

  const { jobId, newJobName } = req.body;
  try {
    if (jobId && newJobName) {
      logger.debug(`renaming job for id: ${jobId} to ${newJobName}`);

      const allJobs = await JobModel.find({ user: userId });
      const jobToRename = await JobModel.findById(jobId);

      if (allJobs.find((job) => (job.name === newJobName))) {
        logger.error(`failed to rename job for id: ${jobId} , Job name: ${newJobName} already exists for user`);

        return res.status(HttpStatus.BAD_REQUEST).send({ result: false, err: `Error: Job name ${newJobName} already exists` });
      }

      if (jobToRename?.user) {
        jobToRename.name = newJobName;
        await jobToRename.save();

        return res.status(HttpStatus.OK).send({ result: true });
      }
    }

    return res.status(HttpStatus.BAD_REQUEST).send({ result: false, err: 'Failed to rename job' });
  } catch (err :any) {
    logger.error(`failed to rename job for id: ${jobId}`);
    return res.status(HttpStatus.BAD_REQUEST).send({ result: false, err: 'Failed to rename job' });
  }
};

export default renameJob;
