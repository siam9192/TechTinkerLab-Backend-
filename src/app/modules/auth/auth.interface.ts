import { Types } from 'mongoose';
import {
  IUserPersonalDetails,
  TLoginActivity,
  TRole,
} from '../user/user.interface';

export interface ICreateUser {
  personal_details: Pick<
    IUserPersonalDetails,
    'name' | 'date_of_birth' | 'gender'
  >;
  email: string;
  username: string;
  password: string;
  role?: TRole;
  activity: IActivity;
}

export interface IActivity {
  user:Types.ObjectId
  browser:string,
  ip_address:string
}

export interface ISignIn {
  email: string;
  password: string;
  activity:IActivity
}
