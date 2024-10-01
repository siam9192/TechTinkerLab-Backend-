import { string, z } from 'zod';
import { VoteType } from '../../utils/constant';

const UpsertReactionValidation = z.object({
  postId: string(),
  vote_type: z.enum(Object.values(VoteType) as [string, ...string[]]),
});

export const ReactionValidations = {
 UpsertReactionValidation
};
