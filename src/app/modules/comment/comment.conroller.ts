import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { sendSuccessResponse } from '../../response';
import catchAsync from '../../utils/catchAsync';
import { CommentService } from './comment.service';

const createComment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await CommentService.createCommentIntoDB(userId, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Comment created successfully',
    data: result,
  });
});

const updateComment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await CommentService.updateCommentIntoDB(userId, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Comment updated successfully',
    data: result,
  });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const commentId = req.params.commentId;
  const result = await CommentService.deleteCommentFromDB(userId, commentId);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Comment deleted successfully',
    data: result,
  });
});

const getPostComments = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.commentId;
  const result = await CommentService.getPostCommentsFromDB(postId, req.query);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Post comments retrieved  successfully',
    data: result,
  });
});

export const CommentController = {
  createComment,
  updateComment,
  deleteComment,
  getPostComments,
};
