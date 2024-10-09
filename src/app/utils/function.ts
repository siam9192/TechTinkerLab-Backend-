import { Types } from 'mongoose';
import { IPost } from '../modules/post/post.interface';
import { IUser, IUserView } from '../modules/user/user.interface';

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

export const getCustomizeUserData = (
  user: IUser,
  personal_details?: boolean,
): IUserView => {
  const latest_subscription = user.latest_subscription;
  const is_verified = latest_subscription
    ? new Date(latest_subscription.subscription_end_date).valueOf() <
      new Date().valueOf()
    : false;
  const data: any = {
    _id:user._id,
    username: user.username,
    profile_photo: user.profile_photo,
    total_follower: user.total_follower,
    total_following: user.total_following,
    is_verified,
  };
  if (personal_details) {
    data.personal_details = user.personal_details;
  }
  return data;
};

export const convertFieldUpdateFormat = (
  doc: any,
  obj: any,
  objFieldName: string,
  avoid_fields?: string[],
) => {
  Object.entries(obj).forEach(([field, value]) => {
    if (
      !avoid_fields ||
      !avoid_fields.length ||
      !avoid_fields.includes(field)
    ) {
      doc[`${objFieldName}.${field}`] = value;
    }
  });
};

export function getDaysInMonth(year: number, month: number) {
  // Create an empty array to store the days
  let days = [];

  // Month in JavaScript Date object is 0-indexed (January is 0, December is 11)
  let date = new Date(year, month, 1);

  // Loop until the next month
  while (date.getMonth() === month) {
    days.push(new Date(date).getDate()); // Add a copy of the date to the array
    date.setDate(date.getDate() + 1); // Move to the next day
  }

  return days;
}

export function getLastDayOfMonth(year: number, month: number) {
  // Set the day to 0 of the next month to get the last day of the current month
  return new Date(year, month + 1, 0);
}

export function getFirstDayOfMonth(year: number, month: number) {
  // Month is 0-indexed in JavaScript (January is 0, December is 11)
  return new Date(year, month, 1);
}

export function dateDifference(startDate: Date, endDate: Date) {
  // Difference in milliseconds
  const diffInMs = Math.abs(endDate.getTime() - startDate.getTime());

  // Convert milliseconds into days, hours, minutes, etc.
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); // Difference in days
  const diffInHours = Math.ceil(diffInMs / (1000 * 60 * 60));     // Difference in hours
  const diffInMinutes = Math.ceil(diffInMs / (1000 * 60));        // Difference in minutes

  return {
    diffInMs,
    diffInDays,
    diffInHours,
    diffInMinutes,
  };
}

