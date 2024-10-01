import { Types } from 'mongoose';

export type TVote = {
  upvote: boolean;
  downvote: boolean;
};

export interface IReaction {
  post: Types.ObjectId;
  user: Types.ObjectId;
  vote: TVote;
  createdAt:Date,
  updatedAt:Date
}
