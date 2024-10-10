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

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const username = req.params.username
  const result = await UserService.getUserProfileFromDB(username);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User profile  retrieved successfully',
    data: result,
  });
});


const getUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getUsersFromDB();
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Users retrieved successfully',
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

const getUserLoginActivities = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const result =
      await UserService.getUserLoginActivities(userId);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'User login activities retrieved successfully',
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

const changeUserRole = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await UserService.changeUserRoleIntoDB(userId, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Role changed successfully',
    data: result,
  });
});

const changeUserBlockStatus = catchAsync(
  async (req: Request, res: Response) => {
    const userRole = req.user.role;
    const result = await UserService.changeUserBlockStatusIntoDB(
      userRole,
      req.body,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'User block status updated successfully',
      data: result,
    });
  },
);

export const UserController = {
  updateProfile,
  getCurrentUser,
  getUsers,
  getCurrentUserLoginActivities,
  changePassword,
  getUserLoginActivities,
  changeUserRole,
  changeUserBlockStatus,
  getUserProfile
};
