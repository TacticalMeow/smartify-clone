import { User, UserConfig } from '@smarter/shared';
import mongoose from 'mongoose';
import { UserDocument, UserModelExtension } from './types';

const UserConfigSchema = new mongoose.Schema<UserConfig>({
  maximumJobs: {
    type: Number,
    required: true,
  },
  maximumProcessorPerJob: {
    type: Number,
    required: true,
  },
});

const userSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    required: true,
  },
  spotifyId: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  config: {
    type: UserConfigSchema,
    required: true,
  },
}, { timestamps: true });

const UserModel = mongoose.model<UserDocument, UserModelExtension>('User', userSchema as any);

export { UserModel };
