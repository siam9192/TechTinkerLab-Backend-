import { Router } from 'express';
import { PostStateController } from './post-state.controller';
import { Roles } from '../../utils/constant';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PostStateValidations } from './post-state.validation';

const router = Router();

router.post(
  '/upsert/:postId',
  auth('USER'),
  PostStateController.upsertPostState,
);
router.patch(
  '/update-vote-status',
  auth('USER'),
  validateRequest(PostStateValidations.UpdateVoteStatusValidation),
  PostStateController.updateVoteStatus,
);

router.get(
  '/user-activity/:postId',
  auth('USER'),
  PostStateController.getUserActivityOfPost,
);

export const PostStateRouter = router;
