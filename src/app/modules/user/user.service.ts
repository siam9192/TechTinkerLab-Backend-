import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import User from './user.model';
import { bcryptCompare, bcryptHash } from '../../utils/bcrypt';
import { ICreateUser } from '../auth/auth.interface';
import { IUser, TRole } from './user.interface';
import {
  convertFieldUpdateFormat,
  getCustomizeUserData,
  objectId,
} from '../../utils/function';

import { Role } from '../../utils/constant';

const createUserIntoDB = async (payload: ICreateUser) => {
  //  Hashing password using bcrypt
  payload.password = await bcryptHash(payload.password);

  payload.role = 'USER';

  return await User.create(payload);
};

const getUserProfileFromDB = async (username:string)=>{
  const user = await User.findOne({username})
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
    username:user.username,
    email: user.email,
    profile_photo:user.profile_photo,
    profile_cover_photo:user.profile_cover_photo,
    personal_details: user.personal_details,
    total_post:user.total_post,
    total_follower:user.total_follower,
    total_following:user.total_following,
    role: user.role,
    is_verified
  };
 
  return data;
  
}

const getUsersFromDB = async () => {
  // Getting users
  const users = await User.find();

  // Return the users data with customize format
  return users.map((user) => {
    const latest_subscription = user.latest_subscription;
     const is_verified = latest_subscription
    ? new Date(latest_subscription.subscription_end_date).valueOf() <
      new Date().valueOf()
    : false;
  const data: any = {
    _id:user._id,
    role:user.role,
    personal_details:user.personal_details,
    username: user.username,
    email:user.email,
    profile_photo: user.profile_photo,
    total_follower: user.total_follower,
    total_following: user.total_following,
    is_verified,
    is_blocked:user.is_blocked,
    is_deleted:user.is_deleted
  }
  return data
})


}

const getCurrentUserFromDB = async (userId: string) => {
  const user = await User.findById(userId);

  //  Checking user existence
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const userLatestSubscription = user.latest_subscription;
  
  //  Checking is user verified by comparing current date and subscription end date
  const is_verified = userLatestSubscription
    ? new Date(userLatestSubscription.subscription_end_date).getTime() >
     Date.now()
    : false;

  const data = {
    _id: user._id,
    username:user.username,
    email: user.email,
    profile_photo:user.profile_photo,
    profile_cover_photo:user.profile_cover_photo,
    personal_details: user.personal_details,
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

  if(payload.profile_cover_photo){
    updateDoc.profile_cover_photo = payload.profile_cover_photo
  }
  if(payload.profile_photo){
    updateDoc.profile_photo = payload.profile_photo
  }

  const personal_details = payload.personal_details;

  if (personal_details?.name) {
    convertFieldUpdateFormat(
      updateDoc,
      payload.personal_details?.name,
      'personal_details.name',
    );
  }

  if (personal_details?.address) {
    convertFieldUpdateFormat(
      updateDoc,
      payload.personal_details?.address,
      'personal_details.address',
    );
  }

  if (personal_details?.study) {
    convertFieldUpdateFormat(
      updateDoc,
      payload.personal_details?.study,
      'personal_details.study',
    );
  }
  if (personal_details) {
    convertFieldUpdateFormat(
      updateDoc,
      payload.personal_details,
      'personal_details',
      ['name', 'address'],
    );
  }

  return await User.findByIdAndUpdate(userId, updateDoc, {
    runValidators: true,
  });
};

const getUserLoginActivities = async (userId: string) => {
  const user = await User.findById(userId);

  //  Checking user existence
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const result = {
    username:user.username,
    name:user.personal_details.name,
    login_activities:user.login_activities
  }

  return result;
};

const changeUserRoleIntoDB = async (
  currentUserRole: TRole,
  payload: {
    user_id: string;
    role: TRole;
  },
) => {
  const user = await User.findById(payload.user_id);
 
  // Checking user existence
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // // Moderator can not change another admin role but he can change his own role
  // if (user.role === Role.ADMIN) {
  //   throw new AppError(
  //     httpStatus.NOT_ACCEPTABLE,
  //     'Admin role can not be changed because only admin can changed his own role',
  //   );
  // }
  // // Moderator can not change another moderator or his own role
  // else if (user.role === Role.MODERATOR && currentUserRole === Role.MODERATOR) {
  //   throw new AppError(
  //     httpStatus.NOT_ACCEPTABLE,
  //     'Only Admin can changed his own role',
  //   );
  // }
  const updateStatus = await User.updateOne({
    _id: user._id,
    role: payload.role,
  });

  if (!updateStatus.modifiedCount) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Role can not be changed.Something want wrong',
    );
  }
  return null;
};

const changeUserBlockStatusIntoDB = async (
  currentUserRole: TRole,
  payload: { user_id: string; status: boolean },
) => {
  const user = await User.findById(payload.user_id);

  //  Checking user existence
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  // const userRole = user.role
  const updateStatus = await User.updateOne(
    { _id: objectId(payload.user_id) },
    { is_blocked: payload.status },
  );
  if (!updateStatus.modifiedCount) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User role can not be changed.something went wrong',
    );
  }
  return null;
};

export const UserService = {
  createUserIntoDB,
  getCurrentUserFromDB,
  getUsersFromDB,
  changePasswordIntoDB,
  updateProfileIntoDB,
  getCurrentUserLoginActivitiesFromDB,
  getUserLoginActivities,
  changeUserRoleIntoDB,
  changeUserBlockStatusIntoDB,
  getUserProfileFromDB
};
