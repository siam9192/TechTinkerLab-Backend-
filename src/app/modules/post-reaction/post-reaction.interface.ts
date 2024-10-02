import { Types } from 'mongoose';

export type TVoteType = 'UP' | 'DOWN';

export interface IPostReaction {
  post: Types.ObjectId;
  user: Types.ObjectId;
  vote_type: TVoteType;
  createdAt: Date;
  updatedAt: Date;
}
