'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.UserValidations = void 0;
const zod_1 = require('zod');
const constant_1 = require('../../utils/constant');
const UserNameSchema = zod_1.z.object({
  first_name: zod_1.z.string(),
  last_name: zod_1.z.string(),
});
const UserPersonalDetailsSchema = zod_1.z.object({
  name: UserNameSchema,
  date_of_birth: zod_1.z.string(),
  gender: zod_1.z.enum(Object.values(constant_1.Gender)),
});
const CreateUserValidation = zod_1.z.object({
  personal_details: UserPersonalDetailsSchema,
  username: zod_1.z.string(),
  password: zod_1.z.string(),
});
exports.UserValidations = {
  CreateUserValidation,
};
