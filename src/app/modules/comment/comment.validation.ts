import { string, z } from 'zod';

const CreateCommentValidation = z.object({
  comment: string(),
  postId: string(),
});

const UpdateCommentValidation = z.object({
  comment: string(),
  commentId: string(),
});

export const CommentValidations = {
  CreateCommentValidation,
  UpdateCommentValidation,
};
