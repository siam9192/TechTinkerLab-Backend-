import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { sendSuccessResponse } from '../../response';
import httpStatus from 'http-status';

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await UserService.updateProfileIntoDB(userId, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Profile updated successfully',
    data: result,
  });
});

const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await UserService.getCurrentUserFromDB(userId);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Current user retrieved successfully',
    data: result,
  });
});

const getCurrentUserLoginActivities = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const result =
      await UserService.getCurrentUserLoginActivitiesFromDB(userId);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Current user login activities retrieved successfully',
      data: result,
    });
  },
);

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await UserService.changePasswordIntoDB(userId, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Password changed successfully',
    data: result,
  });
});

export const UserController = {
  updateProfile,
  getCurrentUser,
  getCurrentUserLoginActivities,
  changePassword,
};
