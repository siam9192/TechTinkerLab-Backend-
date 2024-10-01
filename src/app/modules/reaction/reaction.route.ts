import { Router } from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ReactionValidations } from './reaction.validation';
import { ReactionController } from './reaction.controller';

const router = Router();

router.put(
  '/post/upsert',
  auth('USER'),
  validateRequest(ReactionValidations.UpsertReactionValidation),ReactionController.upsertPostReaction
);

router.get(
  '/current-user/:postId',
  auth('USER'),
  ReactionController.getCurrentUserReactionOfPost,
);

export const ReactionRouter = router;
