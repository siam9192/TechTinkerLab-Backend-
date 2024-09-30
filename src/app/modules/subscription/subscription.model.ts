import { Schema, model, Types } from 'mongoose';
import { ISubscription } from './subscription.interface';

const subscriptionSchema = new Schema<ISubscription>({
  package: {
    type: Schema.Types.ObjectId,
    ref: 'Package',
    required: true,
  },
  payment: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subscription_date: {
    type: Date,
    default: Date.now(),
  },
});

const Subscription = model<ISubscription>('Subscription', subscriptionSchema);

export default Subscription;
