
import QueryBuilder from '../../middlewares/QueryBuilder';
import Payment from './payment.model';
import { objectId } from '../../utils/function';

const getPaymentsFromDB = async (query: any) => {
  console.log(query)
  const result = await new QueryBuilder(Payment.find(), query)
    .sort()
    .paginate()
    .get();
  const meta = await new QueryBuilder(Payment.find(), query).sort().getMeta();
  return {
    result,
    meta,
  };
};

const getUserPaymentsFromDB = async (userId: string, query: any) => {
  query.payer = objectId(userId);
  const result = await new QueryBuilder(Payment.find(), query)
    .find()
    .sort()
    .paginate()
    .get();
  const meta = await new QueryBuilder(Payment.find(), query)
    .find()
    .sort()
    .getMeta();
  return {
    result,
    meta,
  };
};

export const PaymentService = {
  getPaymentsFromDB,
  getUserPaymentsFromDB,
};
