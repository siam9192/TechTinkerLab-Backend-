import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { sendSuccessResponse } from '../../response';
import catchAsync from '../../utils/catchAsync';
import { PostStateService } from './post-state.service';

const upsertPostState = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const postId = req.params.postId;
  const result = await PostStateService.upsertPostState(userId, postId);
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Post state create successfully',
    data: result,
  });
});

const updateVoteStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await PostStateService.updateVoteStatusIntoDB(
    userId,
    req.body,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Post state updated successfully',
    data: result,
  });
});

const getUserActivityOfPost = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const postId = req.params.postId;
    const result = await PostStateService.getUserActivityOfPostFromDB(
      userId,
      postId,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.CREATED,
      message: 'User post activity retrieved successfully',
      data: result,
    });
  },
);

export const PostStateController = {
  updateVoteStatus,
  upsertPostState,
  getUserActivityOfPost,
};
