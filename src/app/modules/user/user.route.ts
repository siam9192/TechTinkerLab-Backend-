import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './user.validation';
import { UserController } from './user.contoller';
import auth from '../../middlewares/auth';
import { Role } from '../../utils/constant';
import { TRole } from './user.interface';

const router = Router();

router.get('/', auth('ADMIN', 'MODERATOR'), UserController.getUsers);

router.get(
  '/current-user',
  auth(...(Object.values(Role) as TRole[])),
  UserController.getCurrentUser,
);
router.get(
  '/current-user/login-activities',
  auth('USER'),
  UserController.getCurrentUserLoginActivities,
);

router.patch(
  '/update-profile',
  auth('USER'),
  validateRequest(UserValidations.UpdateProfileValidation),
  UserController.updateProfile,
);
router.patch(
  '/change-password',
  auth(...(Object.values(Role) as TRole[])),
  validateRequest(UserValidations.ChangePasswordValidation),
  UserController.changePassword,
);

router.patch(
  '/change-role',
  auth('USER'),
  validateRequest(UserValidations.ChangeUserRoleValidation),
  UserController.changeUserRole,
);
router.patch(
  '/change-block-status',
  auth('ADMIN', 'MODERATOR'),
  validateRequest(UserValidations.ChangeUserBlockStatusValidation),
  UserController.changeUserBlockStatus,
);

export const UserRouter = router;
