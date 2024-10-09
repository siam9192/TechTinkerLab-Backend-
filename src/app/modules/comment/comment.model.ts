import { model, Schema } from 'mongoose';
import { IComment } from './comment.interface';
import { number } from 'zod';

const CommentSchema = new Schema<IComment>(
  {
    comment: {
      type: String,
      required: true,
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
    total_upvote:{
      type:Number,
      default:0
    },
    total_downvote:{
      type:Number,
      default:0
    }
  },
  {
    timestamps: true,
  },
);

const Comment = model<IComment>('Comment', CommentSchema);

export default Comment;
