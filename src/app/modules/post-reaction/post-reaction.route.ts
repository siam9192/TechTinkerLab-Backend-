import { Router } from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PostReactionValidations } from './post-reaction.validation';
import { PostReactionController } from './post-reaction.controller';

const router = Router();

router.post(
  '/upsert',
  auth('USER'),
  validateRequest(PostReactionValidations.UpsertPostReactionValidation),
  PostReactionController.upsertPostReaction,
);

router.get(
  '/:postId/current-user',
  auth('USER'),
  PostReactionController.getCurrentUserReactionOfPost,
);

export const PostReactionRouter = router;
