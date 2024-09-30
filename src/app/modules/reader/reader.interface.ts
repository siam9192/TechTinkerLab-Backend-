import { Types } from 'mongoose';

export interface IReader {
  post: Types.ObjectId;
  user: Types.ObjectId;
  createdAt: Types.ObjectId;
}
