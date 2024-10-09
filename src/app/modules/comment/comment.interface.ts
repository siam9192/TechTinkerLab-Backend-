import { Types } from 'mongoose';

export interface IComment {
  comment: string;
  total_upvote?: number;
  total_downvote?: number;
  post: Types.ObjectId;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
