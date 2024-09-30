import { Document, Types } from 'mongoose';

export type TName = {
  first_name: string;
  last_name?: string;
};

export type TGender = 'MALE' | 'FEMALE' | 'OTHERS';
export type TRole = 'USER' | 'MODERATOR' | 'ADMIN';

export type TAddress = {
  city?: string;
  state?: string;
  country?: string;
};

export type TStudy = {
  institute: string;
  degree?: string;
  fieldOfStudy?: string;
  startYear?: number;
  endYear?: number;
  status: 'Attending' | 'Graduated' | 'Dropped Out' | 'Completed';
  description?: string;
};
export type TSubscription = {
  subscription: Types.ObjectId;
  subscription_start_date: Date;
  subscription_end_date: Date;
};

export type TUserNotification = {
  notification: Types.ObjectId;
  read: boolean;
};

export type TLoginLocation = {
  city: string;
  region?: string;
  country: string;
};

export type TDeviceInfo = {
  device: string;
  os?: string;
  browser?: string;
};

export type TLoginActivity = {
  device_info: TDeviceInfo;
  ip_address?: string;
  location?: TLoginLocation;
  login_date: Date;
};

export interface IUserPersonalDetails {
  name: TName;
  date_of_birth?: string;
  gender: TGender;
  address?: TAddress;
  study?: TStudy;
  profession?: string;
}

export interface IUser {
  personal_details: IUserPersonalDetails;
  profile_photo?: string;
  profile_cover_photo?: string;
  email: string;
  username: string;
  password: string;
  role: TRole;
  total_post?: number;
  total_follower?: number;
  total_following?: number;
  is_verified?: boolean;
  latest_subscription?: TSubscription;
  notifications?: TUserNotification[];
  login_activities?: TLoginActivity[];
  is_blocked: boolean;
  is_deleted: boolean;
}
