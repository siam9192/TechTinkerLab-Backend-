import { Types } from 'mongoose';

type TPaymentStatus = 'PENDING' | 'SUCCESS' | 'CANCELED';

export interface IPayment {
  transaction_id: string;
  payer: Types.ObjectId;
  status: TPaymentStatus;
  method: 'STRIPE';
  amount: number;
  purchased_package: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
