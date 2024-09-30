import { Types } from 'mongoose';
import { TVote } from '../post-state/post-state.interface';

export interface IComment {
  comment: string;
  vote?: TVote;
  post: Types.ObjectId;
  author: Types.ObjectId;
}
