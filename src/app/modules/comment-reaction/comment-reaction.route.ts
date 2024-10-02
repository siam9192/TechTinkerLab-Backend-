import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CommentReactionValidations } from './commnet-reaction.validation';
import { CommentReactionController } from './comment-reaction.controller';

const router = Router();

router.post(
  '/upsert',
  auth('ADMIN', 'MODERATOR', 'USER'),
  validateRequest(CommentReactionValidations.UpsertCommentReactionValidation),
  CommentReactionController.upsertCommentReaction,
);

router.get(
  '/:postId/current-user',
  auth('ADMIN', 'MODERATOR', 'USER'),
  CommentReactionController.getCurrentUserCommentsReactionOfPost,
);

export const CommentReactionRouter = router;
