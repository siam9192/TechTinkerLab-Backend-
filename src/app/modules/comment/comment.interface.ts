import { Types } from 'mongoose';
import { TVote } from '../reaction/reaction.interface';

export interface IComment {
  comment: string;
  vote?: TVote;
  total_up_vote?:number,
  total_down_vote?:number
  post: Types.ObjectId;
  author: Types.ObjectId;
  createdAt:Date,
  updatedAt:Date
}
