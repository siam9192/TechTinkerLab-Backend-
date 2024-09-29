import { model, Schema } from 'mongoose';
import { IFollower } from './follower.interface';

const FollowerSchema = new Schema<IFollower>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    follower: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    is_blocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Follower = model<IFollower>('Follower', FollowerSchema);

export default Follower;
