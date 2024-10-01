import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { objectId } from '../../utils/function';
import Package from '../package/package.model';
import Payment from '../payment/payment.model';
import { stripePayment } from '../../payment-method/stripe';
import config from '../../config';
import { PaymentStatus } from '../../utils/constant';
import Subscription from './subscription.model';
import { Response } from 'express';
import User from '../user/user.model';

const packageSubscriptionRequest = async (
  userId: string,
  payload: { package_id: string; redirect_url: string },
) => {
  const subscriptionPackage = await Package.findById(payload.package_id);

  if (!subscriptionPackage) {
    throw new AppError(httpStatus.NOT_FOUND, 'Package not found');
  }

  // Checking validity

  const payment = await Payment.create({
    transaction_id: '000001',
    payer: userId,
    amount: subscriptionPackage.price,
    purchased_package: payload.package_id,
  });

  const checkoutData = {
    service_name: subscriptionPackage.name,
    amount: subscriptionPackage.price,
    success_url: `${config.backend_base_api}/subscriptions/payment/success?payment_id=${payment._id}&redirect_url=${payload.redirect_url}`,
    cancel_url: `${config.backend_base_api}/subscriptions/payment/cancel?payment_id=${payment._id}&redirect_url=${payload.redirect_url}`,
  };
  const checkout_url = await stripePayment(checkoutData);

  if (payment) {
    return {
      checkout_url,
    };
  }
};

const packageSubscriptionPaymentSuccess = async (
  res: Response,
  query: { payment_id: string; redirect_url: string },
) => {
  const paymentId = query.payment_id;
  const redirect_url = query.redirect_url;
  // Checking payment id existence in request query
  if (!paymentId || !redirect_url) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }

  const payment = await Payment.findOne({
    _id: objectId(paymentId),
    status: PaymentStatus.PENDING,
  });

  // checking payment existence
  if (!payment) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }

  const subscriptionPackage = await Package.findById(payment.purchased_package);

  // checking subscription package  existence
  if (!subscriptionPackage) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }

  // checking payment existence
  if (!payment) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }

  // Creating new subscription
  const subscription = await Subscription.create({
    package: payment.purchased_package,
    payment: payment._id,
    user: payment.payer,
  });
  
  // Updating the payment status PENDING to SUCCESS

  await Payment.findByIdAndUpdate(paymentId,{status:PaymentStatus.SUCCESS})

  // Updating the user latest subscription
  await User.findByIdAndUpdate(payment.payer, {
    latest_subscription: {
      subscription: subscription._id,
      subscription_start_date: Date.now(),
      subscription_end_date: new Date(
        Date.now() + subscriptionPackage.expire_after_hours * 60 * 60 * 1000,
      ).toISOString(),
    },
  });

  res.redirect(redirect_url);
};

const packageSubscriptionPaymentCancel = async (
  res: Response,
  query: { payment_id: string; redirect_url: string },
) => {
  const paymentId = query.payment_id;
  const redirect_url = query.redirect_url;
  // Checking payment id existence in request query
  if (!paymentId || !redirect_url) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }

  // Get only pending payment
  const payment = await Payment.findOne({
    _id: objectId(paymentId),
    status: PaymentStatus.PENDING,
  });

  // checking payment existence
  if (!payment) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }

  await payment.updateOne({ status: PaymentStatus.CANCELED });
  res.redirect(redirect_url);
};

export const SubscriptionService = {
  packageSubscriptionRequest,
  packageSubscriptionPaymentSuccess,
  packageSubscriptionPaymentCancel,
};
