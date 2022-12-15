import express from 'express';
import { Endpoints } from '@smarter/shared';
import createJob from 'routes/job/createJob';
import getMyJobs from 'routes/job/getMyJobs';
import getJob from 'routes/job/getJob';
import testJob from 'routes/job/testJob';
import setJobScheduler from 'routes/job/setJobScheduler';
import saveJob from 'routes/job/saveJob';
import getJobScheduler from 'routes/job/getJobScheduler';
import deleteJob from 'routes/job/deleteJob';
import renameJob from 'routes/job/renameJob';

const router = express.Router();

// GET
router.get(Endpoints.getMyJobs, getMyJobs);
router.get(Endpoints.getJob, getJob);
router.get(Endpoints.getJobScheduler, getJobScheduler);

// POST
router.post(Endpoints.testJob, testJob);
router.post(Endpoints.createJob, createJob);
router.post(Endpoints.setJobScheduler, setJobScheduler);
router.post(Endpoints.saveJob, saveJob);
router.post(Endpoints.deleteJob, deleteJob);
router.post(Endpoints.renameJob, renameJob);

export { router as jobRouter };
