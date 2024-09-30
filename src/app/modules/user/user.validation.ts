import { z } from 'zod';
import { Gender, Role } from '../../utils/constant';

const UserNameSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
});

const StudySchema = z.object({
  institute: z.string(),
  degree: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  startYear: z.number().optional(),
  endYear: z.number().optional(),
  status: z.enum(['Attending', 'Graduated', 'Dropped Out', 'Completed']),
  description: z.string().optional(),
});

const UserPersonalDetailsSchema = z.object({
  name: UserNameSchema,
  study: StudySchema.optional(),
  date_of_birth: z.string().optional(),
  gender: z.enum(Object.values(Gender) as [string, ...string[]]),
});

const CreateUserValidation = z.object({
  personal_details: UserPersonalDetailsSchema,
  username: z.string(),
  password: z.string(),
});

export const UpdateProfileValidation = z.object({
  personal_details: UserPersonalDetailsSchema.partial(),
  profile_photo: z.string().optional(),
  profile_cover_photo: z.string().optional(),
});

const ChangePasswordValidation = z.object({
  current_password: z.string(),
  new_password: z
    .string()
    .min(
      6,
      'Password length must be at least minimum  6 character and maximum 28 character',
    )
    .max(
      28,
      'Password length must be at least minimum  6 character and maximum 28 character',
    ),
});


const ChangeUserRoleValidation = z.object({
  user_id:z.string(),
  role:z.enum(Object.values(Role) as [string, ...string[]])
})

export const UserValidations = {
  CreateUserValidation,
  UpdateProfileValidation,
  ChangePasswordValidation,
  ChangeUserRoleValidation
};
