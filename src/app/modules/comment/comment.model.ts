import { model, Schema } from 'mongoose';
import { IComment } from './comment.interface';
import { TVote } from '../post-state/post-state.interface';

const VoteSchema = new Schema<TVote>({
  upvote: { type: Boolean, default: false },
  downvote: { type: Boolean, default: false },
});

const CommentSchema = new Schema<IComment>(
  {
    comment: {
      type: String,
      required: true,
    },
    vote: {
      type: VoteSchema,
      default: {
        upvote: false,
        downvote: false,
      },
    },
    post: {
      type: Schema.ObjectId,
      ref: 'Post',
      required: true,
    },
    author: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Comment = model<IComment>('Comment', CommentSchema);

export default Comment;
