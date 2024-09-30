import { model, Schema, Types } from 'mongoose';
import { IPostState, TVote } from './post-state.interface';

const VoteSchema = new Schema<TVote>({
  upvote: { type: Boolean, default: false },
  downvote: { type: Boolean, default: false },
});

const PostStateSchema = new Schema<IPostState>({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  vote: {
    type: VoteSchema,
    required: true,
  },
  last_read_at: {
    type: Date,
    default: Date.now,
  },
});

const PostState = model<IPostState>('Post-State', PostStateSchema);

export default PostState;
