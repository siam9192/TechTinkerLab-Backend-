import { Router } from 'express';
import auth from '../../middlewares/auth';
import { TRole } from '../user/user.interface';
import { Role } from '../../utils/constant';
import validateRequest from '../../middlewares/validateRequest';
import { FollowerValidations } from './followerValidation';
import { FollowerController } from './follower.controller';

const router = Router();

router.post(
  '/follow',
  auth(...(Object.values(Role) as TRole[])),
  validateRequest(FollowerValidations.CreateFollowerValidation),
  FollowerController.createFollower,
);
router.post(
  '/unfollow',
  auth(...(Object.values(Role) as TRole[])),
  validateRequest(FollowerValidations.UnfollowUserValidation),
  FollowerController.unfollowUser,
);

router.get(
  '/current-user',
  auth('USER'),
  FollowerController.getCurrentUserFollowers,
);

export const FollowerRouter = router;
