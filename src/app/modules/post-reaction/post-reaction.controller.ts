import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { sendSuccessResponse } from '../../response';
import catchAsync from '../../utils/catchAsync';
import { ReactionService } from './post-reaction.service';

const upsertPostReaction = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await ReactionService.upsertPostReactionIntoDB(
    userId,
    req.body,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Reaction upsert successfully',
    data: result,
  });
});

const getCurrentUserReactionOfPost = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const postId = req.params.postId;
    const result = await ReactionService.getUserReactionOfPostFromDB(
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

export const getPostReaction = catchAsync(
  async (req: Request, res: Response) => {
    const postId = req.params.postId;
    const result = await ReactionService.getPostReactionFromDB(postId)
    sendSuccessResponse(res, {
      statusCode: httpStatus.CREATED,
      message: 'Post reaction retrieved successfully',
      data: result,
    });
  },
);

export const PostReactionController = {
  upsertPostReaction,
  getCurrentUserReactionOfPost,
  getPostReaction
};
