import { model, Schema } from 'mongoose';
import { IComment } from './comment.interface';

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
  },
  {
    timestamps: true,
  },
);

const Comment = model<IComment>('Comment', CommentSchema);

export default Comment;
