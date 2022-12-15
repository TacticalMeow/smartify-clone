import mongoose from 'mongoose';
import { User } from '@smarter/shared';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UserDocument extends User, mongoose.Document {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UserModelExtension extends mongoose.Model<UserDocument> {}

export {
  UserDocument,
  UserModelExtension,
};
