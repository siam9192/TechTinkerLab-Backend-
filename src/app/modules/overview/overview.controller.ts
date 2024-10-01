import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { sendSuccessResponse } from '../../response';
import catchAsync from '../../utils/catchAsync';
import { OverviewService } from './overview.service';


const getAdminOverview = catchAsync(async (req: Request, res: Response) => {
  const result = await OverviewService.getAdminOverviewDataFromDB(req.query);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Overview Data retrieved successfully',
    data: result,
  });
});

const getCurrentUserOverview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id
  const result = await OverviewService.getCurrentUserOverviewDataFromDB(userId,req.query);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Overview Data retrieved successfully',
    data: result,
  });
});

const getPostOverviewData =  catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.postId
  const result = await OverviewService.getPostOverviewDataFromDB(postId,req.query as any);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Overview Data retrieved successfully',
    data: result,
  });
});




export const OverviewController = {
  getAdminOverview,
  getCurrentUserOverview,
  getPostOverviewData
}