import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { sendSuccessResponse } from '../../response';
import catchAsync from '../../utils/catchAsync';
import { CommentReactionService } from './comment-reaction.service';

const upsertCommentReaction = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const result = await CommentReactionService.upsertCommentReactionIntoDB(
      userId,
      req.body,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.CREATED,
      message: 'Comment reaction upsert successfully',
      data: result,
    });
  },
);

const getCurrentUserCommentsReactionOfPost = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const postId = req.params.postId;
    const result =
      await CommentReactionService.getCurrentUserCommentsReactionOfPostFromDB(
        userId,
        postId,
      );
    sendSuccessResponse(res, {
      statusCode: httpStatus.CREATED,
      message: 'Comment reaction upsert successfully',
      data: result,
    });
  },
);

export const CommentReactionController = {
  upsertCommentReaction,
  getCurrentUserCommentsReactionOfPost,
};
