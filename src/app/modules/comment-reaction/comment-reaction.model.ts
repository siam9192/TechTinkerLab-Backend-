import { model, Schema } from 'mongoose';
import { ICommentReaction, TVote } from './comment-reaction.interface';
import { VoteType } from '../../utils/constant';

const VoteSchema = new Schema<TVote>({
  upvote: { type: Boolean, default: false },
  downvote: { type: Boolean, default: false },
});

const CommentReactionSchema = new Schema<ICommentReaction>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    vote_type: {
      type: String,
      enum: Object.values(VoteType),
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const CommentReaction = model<ICommentReaction>(
  'CommentReaction',
  CommentReactionSchema,
);
