import { Types } from 'mongoose';

export interface IFollower {
  user: Types.ObjectId;
  follower: Types.ObjectId;
  is_blocked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
