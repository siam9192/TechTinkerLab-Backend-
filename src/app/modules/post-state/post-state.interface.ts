import { Types } from 'mongoose';

export type TVote = {
  upvote: boolean;
  downvote: boolean;
};

export interface IPostState {
  post: Types.ObjectId;
  user: Types.ObjectId;
  vote: TVote;
  last_read_at: Date;
}
