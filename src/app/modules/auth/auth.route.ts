import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from '../user/user.validation';
import { AuthController } from './auth.controller';
import { AuthValidations } from './auth.validation';

const router = Router();

router.post(
  '/signup',
  validateRequest(UserValidations.CreateUserValidation),
  AuthController.handelSignup,
);
router.post(
  '/signIn',
  validateRequest(AuthValidations.SignInValidation),
  AuthController.handelSignIn,
);
router.post(
  '/forget-password',
  validateRequest(AuthValidations.ForgetPasswordValidation),
  AuthController.handelForgetPassword,
);
router.post(
  '/verify-forget-password-request',
  validateRequest(AuthValidations.VerifyForgetPasswordValidation),
  AuthController.handelVerifyForgetPasswordRequest,
);
router.post(
  '/recover-account',
  validateRequest(AuthValidations.RecoverAccountValidation),
  AuthController.handelRecoverAccount,
);

router.get('/refresh-token', AuthController.handelGetAccessToken);
export const AuthRouter = router;
