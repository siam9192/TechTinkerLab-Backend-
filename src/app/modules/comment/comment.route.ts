import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CommentValidations } from './comment.validation';
import { CommentController } from './comment.conroller';

const router = Router();

router.post(
  '/',
  auth('USER'),
  validateRequest(CommentValidations.CreateCommentValidation),
  CommentController.createComment,
);

router.patch(
  '/',
  auth('USER'),
  validateRequest(CommentValidations.UpdateCommentValidation),
  CommentController.updateComment,
);

router.delete('/:commentId', auth('USER'), CommentController.deleteComment);

router.get('/post/:postId', CommentController.getPostComments);

export const CommentRouter = router;
