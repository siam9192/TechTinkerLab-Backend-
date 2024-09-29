import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import User from './user.model';
import { bcryptCompare, bcryptHash } from '../../utils/bcrypt';
import { ICreateUser } from '../auth/auth.interface';
import { IUser } from './user.interface';

const createUserIntoDB = async (payload: ICreateUser) => {
  //  Hashing password using bcrypt
  payload.password = await bcryptHash(payload.password);

  payload.role = 'USER';

  return await User.create(payload);
};

const getUsersFromDB = async () => {};

const getCurrentUserFromDB = async (userId: string) => {
  const user = await User.findById(userId);

  //  Checking user existence
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const userLatestSubscription = user.latest_subscription;

  //  Checking is user verified by comparing current date and subscription end date
  const is_verified = userLatestSubscription
    ? new Date(userLatestSubscription.subscription_end_date).valueOf() <
      new Date().valueOf()
    : false;

  const data = {
    _id: user._id,
    personal_details: user.personal_details,
    email: user.email,
    role: user.role,
    is_verified,
  };
  return data;
};

const getCurrentUserLoginActivitiesFromDB = async (userId: string) => {
  const user = await User.findById(userId);

  //  Checking user existence
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const activities = user.login_activities;
  return activities;
};

const changePasswordIntoDB = async (
  userId: string,
  payload: { current_password: string; new_password: string },
) => {
  const user = await User.findById(userId).select('password');

  // Checking user existence
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const matchPassword = await bcryptCompare(
    payload.current_password,
    user?.password!,
  );

  if (!matchPassword) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'You entered wrong current password',
    );
  }

  // Hashed new password using bcrypt
  const hashedNewPassword = await bcryptHash(payload.new_password);

  const result = await User.updateOne(
    { _id: user._id },
    { password: hashedNewPassword },
  );

  // Checking is the password updated successfully
  if (!result.modifiedCount) {
    throw new AppError(400, 'Password could not be changed');
  }

  return true;
};

export const updateProfileIntoDB = async (
  userId: string,
  payload: Partial<IUser>,
) => {
  const updateDoc: any = {};

  const personal_details = payload.personal_details;

  if (personal_details?.name) {
    Object.entries(personal_details.name).forEach(([field, value]) => {
      updateDoc[`personal_details.name.${field}`] = value;
    });
  }

  if (personal_details?.address) {
    Object.entries(personal_details.address).forEach(([field, value]) => {
      updateDoc[`personal_details.address.${field}`] = value;
    });
  }

  if (personal_details?.study) {
    Object.entries(personal_details.study).forEach(([field, value]) => {
      updateDoc[`personal_details.study.${field}`] = value;
    });
  }

  delete personal_details?.address;

  if (personal_details) {
    Object.entries(personal_details).forEach(([field, value]) => {
      updateDoc[`personal_details.${field}`] = value;
    });
  }

  return await User.findByIdAndUpdate(userId, updateDoc, {
    runValidators: true,
  });
};

export const UserService = {
  createUserIntoDB,
  getCurrentUserFromDB,
  changePasswordIntoDB,
  updateProfileIntoDB,
  getCurrentUserLoginActivitiesFromDB,
};
