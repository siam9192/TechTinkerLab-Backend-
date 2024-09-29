import { model, Schema } from 'mongoose';
import { IAccountRecoverRequest } from './account-recover-request.interface';

const AccountRecoverRequestSchema = new Schema<IAccountRecoverRequest>(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

AccountRecoverRequestSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: 600 },
);

const AccountRecoverRequest = model<IAccountRecoverRequest>(
  'AccountRecoverRequest',
  AccountRecoverRequestSchema,
);

export default AccountRecoverRequest;
