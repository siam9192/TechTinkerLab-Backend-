import mongoose, { Schema } from 'mongoose';
import {
  IUser,
  IUserPersonalDetails,
  TAddress,
  TDeviceInfo,
  TLoginActivity,
  TLoginLocation,
  TName,
  TStudy,
} from './user.interface';
import { Role } from '../../utils/constant';

const NameSchema = new Schema<TName>({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
});

const AddressSchema = new Schema<TAddress>({
  city: {
    type: String,
    default: null,
  },
  state: {
    type: String,
    default: null,
  },
  country: {
    type: String,
    default: null,
  },
});

const StudySchema = new Schema<TStudy>({
  institute: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    default: null,
  },
  fieldOfStudy: {
    type: String,
    default: null,
  },
  startYear: {
    type: Number,
    default: null,
  },
  endYear: {
    type: Number,
    default: null,
  },
  status: {
    type: String,
    enum: ['Attending', 'Graduated', 'Dropped Out', 'Completed'],
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
});

const SubscriptionSchema = new Schema({
  package: {
    type: Schema.Types.ObjectId,
    ref: 'Package',
    required: true,
  },
  subscription_start_date: {
    type: Date,
    required: true,
  },
  subscription_end_date: {
    type: Date,
    default: null,
  },
});

const UserNotificationSchema = new Schema({
  notification: {
    type: Schema.Types.ObjectId,
    ref: 'Notification',
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

const UserLoginActivityLocation = new Schema<TLoginLocation>({
  city: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    default: null,
  },
  country: {
    type: String,
    required: true,
  },
});

const LoginDeviceInfoSchema = new Schema<TDeviceInfo>({
  device: {
    type: String,
    required: true,
  },
  os: {
    type: String,
    default: null,
  },
  browser: {
    type: String,
    default: null,
  },
});

const UserLoginActivity = new Schema<TLoginActivity>({
  device_info: {
    type: LoginDeviceInfoSchema,
    required: true,
  },

  ip_address: {
    type: String,
    default: null,
  },
  location: {
    type: UserLoginActivityLocation,
    default: null,
  },
  login_date: {
    type: Date,
    required: true,
  },
});

const UserPersonalDetailsSchema = new Schema<IUserPersonalDetails>({
  name: { type: NameSchema, required: true },
  date_of_birth: { type: String, default: null },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE', 'OTHER'],
    required: true,
  },
  address: { type: AddressSchema, default: null },
  study: { type: StudySchema, default: null },
  profession: { type: String, default: null },
});

const UserSchema = new Schema<IUser>(
  {
    personal_details: {
      type: UserPersonalDetailsSchema,
      required: true,
    },
    profile_photo: {
      type: String,
      required: false,
    },
    profile_cover_photo: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: 0,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(Role),
    },
    total_post: {
      type: Number,
      default: 0,
      min: 0,
    },
    total_follower: {
      type: Number,
      default: 0,
      min: 0,
    },
    total_following: {
      type: Number,
      default: 0,
      min: 0,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    latest_subscription: {
      type: SubscriptionSchema,
      default: null,
    },
    notifications: {
      type: [UserNotificationSchema],
      default: [],
    },
    login_activities: {
      type: [UserLoginActivity],
      default: [],
    },
    is_blocked: {
      type: Boolean,
      default: false,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
