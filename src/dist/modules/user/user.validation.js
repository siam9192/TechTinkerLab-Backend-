"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = exports.UpdateProfileValidation = void 0;
const zod_1 = require("zod");
const constant_1 = require("../../utils/constant");
const auth_validation_1 = require("../auth/auth.validation");
const UserNameSchema = zod_1.z.object({
    first_name: zod_1.z.string(),
    last_name: zod_1.z.string(),
});
const StudySchema = zod_1.z.object({
    institute: zod_1.z.string(),
    degree: zod_1.z.string().optional(),
    fieldOfStudy: zod_1.z.string().optional(),
    startYear: zod_1.z.number().optional(),
    endYear: zod_1.z.number().optional(),
    status: zod_1.z.enum(['Attending', 'Graduated', 'Dropped Out', 'Completed']),
    description: zod_1.z.string().optional(),
});
const UserPersonalDetailsSchema = zod_1.z.object({
    name: UserNameSchema,
    study: StudySchema.optional(),
    date_of_birth: zod_1.z.string().optional().optional(),
    gender: zod_1.z.enum(Object.values(constant_1.Gender)).optional(),
    about: zod_1.z.string().optional()
});
const CreateUserValidation = zod_1.z.object({
    personal_details: UserPersonalDetailsSchema,
    username: zod_1.z.string(),
    password: zod_1.z.string(),
    activity: auth_validation_1.activity
});
exports.UpdateProfileValidation = zod_1.z.object({
    personal_details: UserPersonalDetailsSchema.partial(),
    profile_photo: zod_1.z.union([zod_1.z.string(), zod_1.z.null()]).optional(),
    profile_cover_photo: zod_1.z.union([zod_1.z.string(), zod_1.z.null()]).optional(),
});
const ChangePasswordValidation = zod_1.z.object({
    current_password: zod_1.z.string(),
    new_password: zod_1.z
        .string()
        .min(6, 'Password length must be at least minimum  6 character and maximum 28 character')
        .max(28, 'Password length must be at least minimum  6 character and maximum 28 character'),
});
const ChangeUserRoleValidation = zod_1.z.object({
    user_id: zod_1.z.string(),
    role: zod_1.z.enum(Object.values(constant_1.Role)),
});
const ChangeUserBlockStatusValidation = zod_1.z.object({
    user_id: zod_1.z.string(),
    status: zod_1.z.boolean(),
});
exports.UserValidations = {
    CreateUserValidation,
    UpdateProfileValidation: exports.UpdateProfileValidation,
    ChangePasswordValidation,
    ChangeUserRoleValidation,
    ChangeUserBlockStatusValidation,
};
