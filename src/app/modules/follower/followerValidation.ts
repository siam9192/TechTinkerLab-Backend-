import { z } from 'zod';

const CreateFollowerValidation = z.object({
  follow_user: z.string(),
});

const UnfollowUserValidation = z.object({
  unfollow_user: z.string(),
});

export const FollowerValidations = {
  CreateFollowerValidation,
  UnfollowUserValidation,
};
