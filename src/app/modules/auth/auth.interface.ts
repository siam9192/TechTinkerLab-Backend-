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
  login_activities: TLoginActivity[];
}

export interface ISignIn {
  email: string;
  password: string;
}
