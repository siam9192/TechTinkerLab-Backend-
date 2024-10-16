import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { sendSuccessResponse } from '../../response';
import catchAsync from '../../utils/catchAsync';
import { FollowerService } from './follower.service';

const createFollower = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await FollowerService.createFollowerIntoDB(userId, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Account followed successfully',
    data: result,
  });
});

const unfollowUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await FollowerService.unfollowUserIntoDB(userId, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Account unfollowed successfully',
    data: result,
  });
});

const getCurrentUserFollowers = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const result = await FollowerService.getUserFollowers(userId, req.query);
    sendSuccessResponse(res, {
      statusCode: httpStatus.CREATED,
      message: 'Followers retrieved successfully',
      data: result.result,
      meta: result.meta,
    });
  },
);

const getAccountFollowStatusOfCurrentUser = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const accountUsername = req.params.username;
    const result =
      await FollowerService.getAccountFollowStatusOfCurrentUserFromDB(
        userId,
       accountUsername,
      );
    sendSuccessResponse(res, {
      statusCode: httpStatus.CREATED,
      message: 'Follow status retrieved successfully',
      data: result,
    });
  },
);

const getProfileFollowers = catchAsync(
  async (req: Request, res: Response) => {
    const accountUsername = req.params.username;
    
    const result =
      await FollowerService.getProfileFollowersFromDB(accountUsername)
    sendSuccessResponse(res, {
      statusCode: httpStatus.CREATED,
      message: 'Follow status retrieved successfully',
      data: result,
    });
  },
);
const getProfileFollowings = catchAsync(
  async (req: Request, res: Response) => {
     const username = req.params.username
    const result =
      await FollowerService.getProfileFollowingsFromDB(
       username
      );
    sendSuccessResponse(res, {
      statusCode: httpStatus.CREATED,
      message: 'Follow status retrieved successfully',
      data: result,
    });
  },
);
export const FollowerController = {
  createFollower,
  unfollowUser,
  getCurrentUserFollowers,
  getAccountFollowStatusOfCurrentUser,
  getProfileFollowers,
  getProfileFollowings
};
