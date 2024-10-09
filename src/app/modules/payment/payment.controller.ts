import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { sendSuccessResponse } from '../../response';
import catchAsync from '../../utils/catchAsync';
import { PaymentService } from './payment.service';

const getPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getPaymentsFromDB(req.query);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Payments retrieved successfully',
    data: result,
  });
});

const getCurrentUserPayments = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const result = await PaymentService.getUserPaymentsFromDB(
      userId,
      req.query,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Payments retrieved successfully',
      data: result.result,
      meta:result.meta
    });
  },
);

export const PaymentController = {
  getPayments,
  getCurrentUserPayments,
};
