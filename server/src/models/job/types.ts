import mongoose from 'mongoose';
import { Job } from '@smarter/shared';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface JobDocument extends Job, mongoose.Document, mongoose.SchemaTimestampsConfig {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface JobModelExtension extends mongoose.Model<JobDocument> {}

export {
  JobDocument,
  JobModelExtension,
};
