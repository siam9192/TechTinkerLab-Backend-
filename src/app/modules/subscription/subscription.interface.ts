import { Types } from 'mongoose';

export interface ISubscription {
  package: Types.ObjectId;
  payment: Types.ObjectId;
  user: Types.ObjectId;
  subscription_date: Date;
}
