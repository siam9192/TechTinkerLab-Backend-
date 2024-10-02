import { model, Schema, Types } from 'mongoose';
import { IPostReaction } from './post-reaction.interface';
import { VoteType } from '../../utils/constant';

const ReactionSchema = new Schema<IPostReaction>(
  {
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

const PostReaction = model<IPostReaction>('PostReaction', ReactionSchema);

export default PostReaction;
