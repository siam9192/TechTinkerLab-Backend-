import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { sendSuccessResponse } from '../../response';
import catchAsync from '../../utils/catchAsync';
import { AuthService } from './auth.service';
import AppError from '../../Errors/AppError';

const handelSignup = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.signup(req.body, req);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Sign up successful',
    data: result,
  });
});

const handelSignIn = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.signIn(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Sign in successful',
    data: result,
  });
});

const handelGetAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.headers.authorization;
  if (!refreshToken) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }
  const result = await AuthService.getAccessToken(refreshToken);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Access token retrieved successfully',
    data: result,
  });
});

const handelForgetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.forgetPassword(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'OTP has been send',
    data: result,
  });
});

const handelVerifyForgetPasswordRequest = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthService.verifyForgetPasswordRequest(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'OTP verified successfully',
      data: result,
    });
  },
);

const handelRecoverAccount = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.recoverAccount(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Password changed successfully',
    data: result,
  });
});

const handelLogout = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id
  const result = await AuthService.logout(userId,req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Logout successful',
    data: result,
  });
});



export const AuthController = {
  handelSignup,
  handelSignIn,
  handelGetAccessToken,
  handelForgetPassword,
  handelVerifyForgetPasswordRequest,
  handelRecoverAccount,
  handelLogout
};
