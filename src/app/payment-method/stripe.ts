import config from '../config';

const stripe = require('stripe')(config.stripe_secret);

type TStripPaymentData = {
  service_name: string;
  amount: number;
  success_url: string;
  cancel_url: string;
};

export const stripePayment = async (data: TStripPaymentData) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: data.service_name,
          },
          unit_amount: Math.round(data.amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    // The URL of your payment completion page
    success_url: data.success_url,
    cancel_url: data.cancel_url,
  });

  return session.url;
};

export const stripeSessionRetrieve = async (sessionId: string) => {
  return await stripe.checkout.sessions.retrieve(sessionId);
};
