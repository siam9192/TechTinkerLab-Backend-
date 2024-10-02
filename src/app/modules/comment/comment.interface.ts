import { Types } from 'mongoose';

export interface IComment {
  comment: string;
  total_up_vote?: number;
  total_down_vote?: number;
  post: Types.ObjectId;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
