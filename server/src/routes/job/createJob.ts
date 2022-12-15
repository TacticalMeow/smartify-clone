import { Request, Response } from 'express';
import { CreateJob, CreateJobRequest, USER_ID_COOKIE } from '@smarter/shared';
import { logger } from 'logger';
import { JobModel } from 'models/job';
import { UserModel } from 'models/user';
import HttpStatus from 'http-status-codes';

const createJob = async (
  req: Request<object, object, CreateJobRequest>,
  res: Response<CreateJob>,
) => {
  const userId = req.cookies[USER_ID_COOKIE];
  const user = await UserModel.findById(userId);

  if (!user) {
    return res.status(HttpStatus.UNAUTHORIZED).send();
  }

  try {
    logger.info(`creating new job for user ${user.id}`);

    const jobs = await JobModel.find({ user });
    if (jobs.length >= user.config.maximumJobs) {
      logger.warn(`cannot create new job for user: ${user.id}, maximum jobs allowed: ${user.config.maximumJobs}`);

      return res.status(HttpStatus.BAD_REQUEST).send();
    }

    const newJob = await JobModel.create({
      user,
      name: req.body.name,
    });

    return res.status(200).json({
      id: newJob._id,
    });
  } catch (err: any) {
    logger.error(`failed to create job: ${err.stack}`);

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
  }
};

export default createJob;
