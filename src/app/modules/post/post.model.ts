import { model, Schema } from 'mongoose';
import { IPost } from './post.interface';

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    is_premium: {
      type: Boolean,
      default: false,
    },
    is_private: {
      type: Boolean,
      default: false,
    },
    total_earning: {
      type: Number,
      min: 0,
      default: 0,
    },
    total_upvote: {
      type: Number,
      min: 0,
      default: 0,
    },
    total_downvote: {
      type: Number,
      min: 0,
      default: 0,
    },
    total_read: {
      type: Number,
      min: 0,
      default: 0,
    },
    total_reader: {
      type: Number,
      min: 0,
      default: 0,
    },
    total_gained_follower: {
      type: Number,
      min: 0,
      default: 0,
    },
    total_lost_follower: {
      type: Number,
      min: 0,
      default: 0,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

PostSchema.index({
  title: 'text',
  content: 'text',
  category: 'text',
  tags: 'text',
});

const Post = model<IPost>('Post', PostSchema);

export default Post;
