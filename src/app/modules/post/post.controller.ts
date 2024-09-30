import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { sendSuccessResponse } from '../../response';
import catchAsync from '../../utils/catchAsync';
import { PostService } from './post.service';

const createPost = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await PostService.createPostIntoDB(userId, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Post created successfully',
    data: result,
  });
});

const updatePost = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const postId = req.params.postId;
  const result = await PostService.updatePostIntoDB(userId, postId, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Post updated successfully',
    data: result,
  });
});

const deletePost = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const postId = req.params.postId;
  const result = await PostService.deletePostFromDB(userId, postId);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Post deleted successfully',
    data: result,
  });
});

const getPosts = catchAsync(async (req: Request, res: Response) => {
  const result = await PostService.getPostsFromDB(req.query);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Posts retrieved successfully',
    data: result,
  });
});

const getPostForUserRead = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const postId = req.params.postId;
  const result = await PostService.getPostForUserReadFromDB(
    userId,
    postId as string,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Post retrieved successfully',
    data: result,
  });
});

export const PostController = {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getPostForUserRead,
};
