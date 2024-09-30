import { model, Schema } from 'mongoose';
import { IPayment } from './payment.interface';
import { PaymentStatus } from '../../utils/constant';

const PaymentSchema = new Schema<IPayment>(
  {
    transaction_id: {
      type: String,
      required: true,
    },
    payer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: 'PENDING',
    },
    method: {
      type: String,
      enum: ['STRIPE'],
      default: 'STRIPE',
    },
    amount: {
      type: Number,
      min: 0,
      required: true,
    },
    purchased_package: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
    },
  },
  {
    timestamps: true,
  },
);

const Payment = model<IPayment>('Payment', PaymentSchema);

export default Payment;
