import { z } from 'zod';
export const activity = z.object({
  browser:z.string(),
  ip_address:z.string()
})
const SignInValidation = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Enter valid email'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 character'),
    activity
});

const ForgetPasswordValidation = z.object({
  email: z.string(),
});

const VerifyForgetPasswordValidation = z.object({
  secret: z.string(),
  otp: z.string().min(6, 'OTP Must be 6 character'),
});

const RecoverAccountValidation = activity


export const AuthValidations = {
  SignInValidation,
  ForgetPasswordValidation,
  VerifyForgetPasswordValidation,
  RecoverAccountValidation,
};
