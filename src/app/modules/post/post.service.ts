import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import QueryBuilder from '../../middlewares/QueryBuilder';
import { getCustomizePostData, objectId } from '../../utils/function';
import User from '../user/user.model';
import { IPost } from './post.interface';
import Post from './post.model';
import { startSession } from 'mongoose';

const createPostIntoDB = async (userId: string, payload: IPost) => {
  payload.author = objectId(userId);
  const session = await startSession();
  await session.startTransaction();
  try {
    const createdPost = await Post.create([payload], { session });
    // Checking is the post created successfully
    if (!createdPost) {
      throw new Error();
    }

    const updatedUserStatus = await User.updateOne(
      { _id: objectId(userId) },
      { $inc: { total_post: 1 } },
    );

    // Checking  is the user post count updates successfully
    if (!updatedUserStatus.modifiedCount) {
      throw new Error();
    }
    await session.commitTransaction();
    await session.endSession();

    return createdPost;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Post can not be created.something went wrong',
    );
  }
};

const getPostsFromDB = async (query: any) => {
  let result = await new QueryBuilder(Post.find(), query)
    .find()
    .textSearch()
    .sort()
    .paginate()
    .populate('author')
    .get();
  const meta = await new QueryBuilder(Post.find(), query)
    .find()
    .textSearch()
    .getMeta();

  result = result.map((post) => getCustomizePostData(post));
  return {
    result,
    meta,
  };
};

const getPostForUserReadFromDB = async (userId: string, postId: string) => {
  if (!postId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post id is is required');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const userLatestSubscription = user.latest_subscription;

  //  Checking is user verified by comparing current date and subscription end date
  const isUserVerified = userLatestSubscription
    ? new Date(userLatestSubscription.subscription_end_date).valueOf() <
      new Date().valueOf()
    : false;

  const post = await Post.findById(postId)
    .select(
      'title content category tags is_premium total_upvote total_downvote total_read total_reader author',
    )
    .populate('author');

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }
  //  if user is not verified and the post is premium content then throw an error
  if (post.is_premium && !isUserVerified) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'This is premium content.Please Subscribe our monthly package to  access all of premium contents',
    );
  }

  const result = getCustomizePostData(post);

  return result;
};

export const updatePostIntoDB = async (
  userId: string,
  postId: string,
  payload: Partial<IPost>,
) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  } else if (post.author.toString() !== userId) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'Post can not be updated');
  }

  const updatedPost = await Post.findByIdAndUpdate(postId, payload, {
    new: true,
  });
  if (!updatedPost) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'Post can not be updated');
  }
  return null;
};

const deletePostFromDB = async (userId: string, postId: string) => {
  const post = await Post.findById(postId);

  //  Checking post existence
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  // Checking is the author of this post is user
  else if (post.author.toString() !== userId) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'Post can not be deleted');
  }

  const session = await startSession();
  await session.startTransaction();

  try {
    // Deleting post
    const deleteStatus = await Post.deleteOne({ _id: post._id }, { session });

    // Checking the post successfully deleted
    if (!deleteStatus.deletedCount) {
      throw new Error();
    }

    const userUpdateStatus = await User.updateOne(
      { _id: objectId(userId) },
      { $inc: { total_post: -1 } },
      { session },
    );

    // Checking the user post count undated successfully
    if (!userUpdateStatus.modifiedCount) {
      throw new Error();
    }

    await session.commitTransaction();
    await session.endSession();
    return null;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Post can not be deleted something went wrong',
    );
  }
};

export const PostService = {
  createPostIntoDB,
  updatePostIntoDB,
  deletePostFromDB,
  getPostsFromDB,
  getPostForUserReadFromDB,
};
