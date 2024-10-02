import { z } from 'zod';
import { VoteType } from '../../utils/constant';

const UpsertCommentReactionValidation = z.object({
  commentId: z.string(),
  vote_type: z.enum(Object.values(VoteType) as [string, ...string[]]),
});

export const CommentReactionValidations = {
  UpsertCommentReactionValidation,
};
