import { Request } from 'express';
import config from '../../config';
import { generateJwtToken, verifyToken } from '../../utils/jwt';
import { UserService } from '../user/user.service';
import { IActivity, ICreateUser, ISignIn } from './auth.interface';
import axios from 'axios';
import useragent from 'useragent';
import User from '../user/user.model';
import AppError from '../../Errors/AppError';
import httpStatus from 'http-status';
import { bcryptCompare, bcryptHash } from '../../utils/bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import AccountRecoverRequest from '../account-recover-request/account-recover-request.model';
import { generateOTP, objectId } from '../../utils/function';
import sendAccountRecoverEmail from '../../email/account-recover-email';
import { IAccountRecoverRequest } from '../account-recover-request/account-recover-request.interface';
import { UserActivityService } from '../user-activity/user-activity.service';

const signup = async (payload: ICreateUser, req: Request) => {
  const user = await User.findOne({
    $or: [{ email: payload.email }, { username: payload.username }],
  });

  //  Checking user existence
  if (user) {
    if (user.email === payload.email) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        'User is already exists on this email',
      );
    } else if (user.username === payload.username) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        'User is already exists on this username',
      );
    } else {
      throw new AppError(httpStatus.NOT_ACCEPTABLE, 'User is already exists');
    }
  }
 

  const createdUser = await UserService.createUserIntoDB(payload);
  const activity = {
    ...payload.activity,
    user:createdUser._id
  }
  await UserActivityService.createUserActivityIntoDB('Login',activity)

  const tokenPayload = {
    id: createdUser._id,
    role: createdUser.role,
  };

  // Generating access token
  const accessToken = await generateJwtToken(
    tokenPayload,
    config.jwt_access_secret as string,
    '30d',
  );
  // Generating refresh token
  const refreshToken = await generateJwtToken(
    tokenPayload,
    config.jwt_refresh_token_secret as string,
    config.jwt_refresh_token_expire_time as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const signIn = async (payload: ISignIn) => {
  const user = await User.findOne({
    email: payload.email,
    is_deleted: false,
  }).select('password role');
 
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'Account not found');
  }

  // Comparing password
  const isMatched = await bcryptCompare(payload.password, user.password);

  // Checking is password correct
  if (!isMatched) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Wrong password');
  }

  const tokenPayload = {
    id: user._id,
    role: user.role,
  };
   
  const activity = {
    ...payload.activity,
    user:user._id
  }
  await UserActivityService.createUserActivityIntoDB('Login',activity)
  // Generating access token
  const accessToken = await generateJwtToken(
    tokenPayload,
    config.jwt_access_secret as string,
    '30d',
  );
  // Generating refresh token
  const refreshToken = await generateJwtToken(
    tokenPayload,
    config.jwt_refresh_token_secret as string,
    config.jwt_refresh_token_expire_time as string,
  );
  return {
    accessToken,
    refreshToken,
  };
};

const getAccessToken = async (refreshToken: string) => {
  try {
    const decode = verifyToken(
      refreshToken,
      config.jwt_refresh_token_secret as string,
    ) as JwtPayload & { id: string; role: string };
    if (!decode) {
      throw new Error();
    }

    const user = await User.findById(decode.id);
    if (!user) {
      throw new Error();
    }

    const tokenPayload = {
      id: user._id,
      role: user.role,
    };

    // Generating access token
    const accessToken = generateJwtToken(
      tokenPayload,
      config.jwt_access_secret as string,
      '30d',
    );
    return {
      accessToken,
    };
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are unauthorized!');
  }
};

const forgetPassword = async (payload: IAccountRecoverRequest) => {
  const user = await User.findOne({ email: payload.email });

  // checking user existence
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'Account not found');
  }

  // Generating otp code
  const otp = generateOTP();

  // Sending otp
 
    await sendAccountRecoverEmail(
      user.email,
      user.personal_details.name.first_name,
      otp,
    ),

  payload.otp = await bcryptHash(otp);

  const recoverRequest = await AccountRecoverRequest.create(payload);

  const jwtPayload = {
    requestId: recoverRequest._id,
    email: payload.email,
  };

  //  Creating jwt secret send to client side
  const secret = generateJwtToken(
    jwtPayload,
    config.jwt_ac_verify_secret as string,
    '20m',
  );

  return {
    secret,
  };
};

const verifyForgetPasswordRequest = async (payload: {
  secret: string;
  otp: string;
}) => {
  const decode = (await verifyToken(
    payload.secret,
    config.jwt_ac_verify_secret as string,
  )) as JwtPayload & { requestId: string; userId: string };

  // Checking is secret successfully decoded
  if (!decode) {
    throw new AppError(httpStatus.BAD_REQUEST, 'something went wrong');
  }

  const user = await User.findOne({ email: decode.email, is_deleted: false });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.is_blocked) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'You can not recover your account because your account is blocked',
    );
  }
  const request = await AccountRecoverRequest.findOne({
    _id: objectId(decode.requestId),
  });

  // Checking  account  recover existence
  if (!request) {
    throw new AppError(httpStatus.BAD_REQUEST, 'something went wrong');
  }

  // Matching main OTP with payload otp
  const match = await bcryptCompare(payload.otp, request.otp);

  // checking is OTP matched
  if (!match) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Wrong OTP');
  }

  // Checking is the  request already verified
  if (request.is_verified) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'This OTP already has been used',
    );
  }

  await AccountRecoverRequest.findByIdAndUpdate(decode.requestId, {
    is_verified: true,
  });

  const jwtPayload = {
    userId: user._id.toString(),
    requestId: decode.requestId,
  };
  const secret = generateJwtToken(
    jwtPayload,
    config.jwt_ac_verify_secret as string,
    '20m',
  );
  return {
    secret,
  };
};

const recoverAccount = async (payload: {
  secret: string;
  password: string;
}) => {
  
  // Decoding the secret
  const decoded = (await verifyToken(
    payload.secret,
    config.jwt_ac_verify_secret as string,
  )) as JwtPayload & { requestId: string; userId: string };

  // Checking is the secret successfully decoded
  if (!decoded) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }

  const request = await AccountRecoverRequest.findOne({
    _id: objectId(decoded.requestId),
  });
  // Checking  account  recover existence
  if (!request) {
    throw new AppError(httpStatus.BAD_REQUEST, 'something went wrong');
  }

  const user = await User.findOne({
    _id: objectId(decoded.userId),
    is_deleted: false,
  });

  // Checking user existence
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Checking is the user is blocked
  if (user.is_blocked) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'You can not recover your account because your account is blocked',
    );
  }

  // hashing the new password
  const newPassword = await bcryptHash(payload.password);

  const updateStatus = await User.updateOne(
    { _id: user._id },
    { password: newPassword },
  );

  if (!updateStatus.modifiedCount) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password couldn't be changed something went wrong",
    );
  }

  return null;
};


const logout = async(userId:string,payload:IActivity)=>{
    payload.user = objectId(userId)
    await UserActivityService.createUserActivityIntoDB('Logout',payload)
}

export const AuthService = {
  signup,
  signIn,
  getAccessToken,
  forgetPassword,
  verifyForgetPasswordRequest,
  recoverAccount,
  logout
};
