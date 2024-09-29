import { z } from 'zod';

const SignInValidation = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Enter valid email'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 character'),
});

const ForgetPasswordValidation = z.object({
  email: z.string(),
});

const VerifyForgetPasswordValidation = z.object({
  secret: z.string(),
  otp: z.string().min(6, 'OTP Must be 6 character'),
});

const RecoverAccountValidation = z.object({
  secret: z.string(),
  password: z.string(),
});

export const AuthValidations = {
  SignInValidation,
  ForgetPasswordValidation,
  VerifyForgetPasswordValidation,
  RecoverAccountValidation,
};
