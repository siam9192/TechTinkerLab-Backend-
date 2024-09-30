import { Types } from 'mongoose';
import { IPost } from '../modules/post/post.interface';
import { IUser } from '../modules/user/user.interface';

export const generateOTP = (length = 6) => {
  const numbers: number[] = [];

  for (let i = 0; i < length; i++) {
    const number = Math.round(Math.random() * 9);
    numbers.push(number);
  }
  return numbers.join('');
};

export const objectId = (id: string) => new Types.ObjectId(id);

export const getCustomizePostData = (post: IPost) => {
  const tempDoc: any = { ...post };
  const doc = tempDoc._doc;
  const author = tempDoc._doc.author;

  const author_latest_subscription = author.latest_subscription;

  const is_verified = author_latest_subscription
    ? new Date(author_latest_subscription.subscription_end_date).valueOf() <
      new Date().valueOf()
    : false;

  const result = {
    ...doc,
    author: {
      username: author.username,
      profile_photo: author.profile_photo,
      total_follower: author.total_follower,
      total_following: author.total_following,
      is_verified,
    },
  };
  return result;
};

export const getCustomizeUserData = (user: IUser) => {
  const latest_subscription = user.latest_subscription;
  const is_verified = latest_subscription
    ? new Date(latest_subscription.subscription_end_date).valueOf() <
      new Date().valueOf()
    : false;
  return {
    username: user.username,
    profile_photo: user.profile_photo,
    total_follower: user.total_follower,
    total_following: user.total_following,
    is_verified,
  };
};
