import { model, Schema, Types } from 'mongoose';
import { IReaction, TVote } from './reaction.interface';


const VoteSchema = new Schema<TVote>({
  upvote: { type: Boolean, default: false },
  downvote: { type: Boolean, default: false },
});

const ReactionSchema = new Schema<IReaction>({
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
},{
    timestamps:true
});

const Reaction = model<IReaction>('Reaction', ReactionSchema);

export default Reaction;
