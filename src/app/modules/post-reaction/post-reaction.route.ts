import { Router } from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PostReactionValidations } from './post-reaction.validation';
import { PostReactionController } from './post-reaction.controller';

const router = Router();

router.post(
  '/upsert',
  auth('USER','ADMIN','MODERATOR'),
  validateRequest(PostReactionValidations.UpsertPostReactionValidation),
  PostReactionController.upsertPostReaction,
);

router.get(
  '/:postId/current-user',
  auth('USER','ADMIN','MODERATOR'),
  PostReactionController.getCurrentUserReactionOfPost,
);
router.get('/post/:postId',PostReactionController.getPostReaction)
export const PostReactionRouter = router;
