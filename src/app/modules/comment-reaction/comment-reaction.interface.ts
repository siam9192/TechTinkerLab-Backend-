import { Types } from 'mongoose';

export type TVote = 'UP' | 'DOWN';

export interface ICommentReaction {
  post: Types.ObjectId;
  comment: Types.ObjectId;
  user: Types.ObjectId;
  vote_type: TVote;
  createdAt: Date;
  updatedAt: Date;
}
