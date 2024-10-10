import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { sendSuccessResponse } from '../../response';
import catchAsync from '../../utils/catchAsync';
import { SubscriptionService } from './subscription.service';

const handelPackageSubscriptionRequest = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const result = await SubscriptionService.packageSubscriptionRequest(
      userId,
      req.body,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Checkout url retrieved successfully',
      data: result,
    });
  },
);

const handelPackageSubscriptionPaymentSuccess = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubscriptionService.packageSubscriptionPaymentSuccess(
      res,
      req.query as { payment_id: string; redirect_url: string },
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Payment  successful',
      data: result,
    });
  },
);

const handelPackageSubscriptionPaymentCancel = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubscriptionService.packageSubscriptionPaymentCancel(
      res,
      req.query as { payment_id: string; redirect_url: string },
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Payment  canceled',
      data: result,
    });
  },
);

const getCurrentUserLatestSubscription = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id
    
    const result = await SubscriptionService.getCurrentUserLatestSubscriptionFromDB(
   userId
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Latest Subscription Retrieved successfully',
      data: result,
    });
  },
);

export const SubscriptionController = {
  handelPackageSubscriptionRequest,
  handelPackageSubscriptionPaymentSuccess,
  handelPackageSubscriptionPaymentCancel,
  getCurrentUserLatestSubscription
};
