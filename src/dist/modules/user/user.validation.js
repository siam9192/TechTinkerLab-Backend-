"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = exports.UpdateProfileValidation = void 0;
const zod_1 = require("zod");
const constant_1 = require("../../utils/constant");
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
    date_of_birth: zod_1.z.string().optional(),
    gender: zod_1.z.enum(Object.values(constant_1.Gender)),
});
const CreateUserValidation = zod_1.z.object({
    personal_details: UserPersonalDetailsSchema,
    username: zod_1.z.string(),
    password: zod_1.z.string(),
});
exports.UpdateProfileValidation = zod_1.z.object({
    personal_details: UserPersonalDetailsSchema.partial(),
    profile_photo: zod_1.z.string().optional(),
    profile_cover_photo: zod_1.z.string().optional(),
});
const ChangePasswordValidation = zod_1.z.object({
    current_password: zod_1.z.string(),
    new_password: zod_1.z
        .string()
        .min(6, 'Password length must be at least minimum  6 character and maximum 28 character')
        .max(28, 'Password length must be at least minimum  6 character and maximum 28 character'),
});
exports.UserValidations = {
    CreateUserValidation,
    UpdateProfileValidation: exports.UpdateProfileValidation,
    ChangePasswordValidation,
};
