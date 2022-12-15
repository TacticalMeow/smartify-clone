import { Job } from '@smarter/shared';
import mongoose, { Schema } from 'mongoose';
import { JobDocument, JobModelExtension } from './types';

const jobSchema = new mongoose.Schema<Job>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  flow: {
    type: Object,
    default: {
      nodes: [],
      edges: [],
      viewport: {},
    },
  },
  history: {
    type: [Object],
    default: [],
  },
}, { timestamps: true });

const JobModel = mongoose.model<JobDocument, JobModelExtension>('Job', jobSchema as any);

export { JobModel };
