
import { model, Schema } from "mongoose";
import { ICommentReaction, TVote } from "./comment-reaction.interface";

const VoteSchema = new Schema<TVote>({
    upvote: { type: Boolean, default: false },
    downvote: { type: Boolean, default: false },
  });


const CommentReactionSchema = new Schema<ICommentReaction>(
    {
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
  
    vote: {
      type: VoteSchema,
      required: true,
    },
  },{
      timestamps:true
  })


  export const CommentReaction = model<ICommentReaction>('CommentReaction',CommentReactionSchema)