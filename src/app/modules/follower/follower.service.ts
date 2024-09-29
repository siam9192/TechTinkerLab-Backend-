import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { objectId } from '../../utils/function';
import Follower from './follower.model';
import { startSession } from 'mongoose';
import User from '../user/user.model';
import QueryBuilder from '../../middlewares/QueryBuilder';

const createFollowerIntoDB = async (
  userId: string,
  payload: { follow_user: string },
) => {
  const follower = await Follower.findOne({
    user: objectId(userId),
    following_user: objectId(payload.follow_user),
  });

  //  Checking is requested user already followed this user
  if (follower) {
    throw new AppError(httpStatus.FOUND, 'Already following');
  }

  const data = {
    user: payload.follow_user,
    follower: userId,
  };

  const session = await startSession();
  await session.startTransaction();

  try {
    const createdFollower = await Follower.create([data], { session });
    const updatedUser1 = await User.updateOne(
      { _id: objectId(userId) },
      { $inc: { total_following: 1 } },
      { session },
    );
    const updatedUser2 = await User.updateOne(
      { _id: objectId(payload.follow_user) },
      { $inc: { total_follower: 1 } },
      { session },
    );

    if (
      !createdFollower[0] ||
      !updatedUser1.modifiedCount ||
      !updatedUser2.modifiedCount
    ) {
      throw new Error();
    }

    await session.commitTransaction();
    await session.endSession();
    return createdFollower;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Can not be followed something went wrong!-',
    );
  }
};

const unfollowUserIntoDB = async (
  userId: string,
  payload: { unfollow_user: string },
) => {
  const follower = await Follower.findOne({
    user: objectId(userId),
    following_user: objectId(payload.unfollow_user),
  });

  //  Checking follower existence
  if (!follower) {
    throw new AppError(httpStatus.NOT_FOUND, 'Follower not found');
  }

  const session = await startSession();
  await session.startTransaction();

  try {
    const deletedFollower = await Follower.deleteOne({ _id: follower._id });

    const updatedUser1 = await User.updateOne(
      { _id: objectId(userId) },
      { $inc: { total_following: -1 } },
      { session },
    );

    const updatedUser2 = await User.updateOne(
      { _id: objectId(payload.unfollow_user) },
      { $inc: { total_follower: -1 } },
      { session },
    );

    if (
      !deletedFollower.deletedCount ||
      !updatedUser1.modifiedCount ||
      !updatedUser2.modifiedCount
    ) {
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
      'Can not be unfollow something went wrong!-',
    );
  }
};

const getUserFollowers = async (userId: string, query: any) => {
  query.follower = objectId(userId);
  const result = await new QueryBuilder(Follower.find(), query)
    .search(['username'])
    .find()
    .sort()
    .paginate()
    .populate('follower')
    .get();

  const meta = await new QueryBuilder(Follower.find(), query)
    .search(['username'])
    .find()
    .getMeta();
  //  result = result.map(item=>{
  //   return Object.keys(item).map(key=>{

  //   })
  //  })
  return {
    result,
    meta,
  };
};

export const FollowerService = {
  createFollowerIntoDB,
  unfollowUserIntoDB,
  getUserFollowers,
};
