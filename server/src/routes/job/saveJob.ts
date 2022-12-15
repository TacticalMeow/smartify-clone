import { Request, Response } from 'express';
import { SaveJobResult, SaveJobRequest, USER_ID_COOKIE } from '@smarter/shared';
import { logger } from 'logger';
import { JobModel } from 'models/job';
import HttpStatus from 'http-status-codes';
import { UserModel } from 'models/user';

const saveJob = async (
  req: Request<object, object, SaveJobRequest>,
  res: Response<SaveJobResult>,
) => {
  const { jobId, flow } = req.body;
  const userId = req.cookies[USER_ID_COOKIE];
  const user = await UserModel.findById(userId);

  if (!user) {
    return res.status(HttpStatus.UNAUTHORIZED).send();
  }

  if (jobId && flow) {
    try {
      logger.info(`saving job for id: ${jobId}`);
      const jobFromDb = await JobModel.findById(jobId);

      if (flow.nodes.length >= user.config.maximumProcessorPerJob) {
        logger.warn(`cannot save job: ${jobId}, maximum processor allowed id: ${user.config.maximumProcessorPerJob}, current: ${flow.nodes.length}`);

        return res.status(HttpStatus.BAD_REQUEST).send();
      }

      if (jobFromDb) {
        jobFromDb.flow = flow;
        await jobFromDb.save();
        return res.status(HttpStatus.OK).send({
          result: true,
        });
      }
    } catch (err: any) {
      logger.error(`error saving job to db: ${err.stack}`);
      return res.status(HttpStatus.BAD_REQUEST).send({
        result: false,
        errors: [{ message: 'error saving job to db.' }],
      });
    }
  }

  return res.status(HttpStatus.BAD_REQUEST).send();
};

export default saveJob;
