'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.AuthRouter = void 0;
const express_1 = require('express');
const validateRequest_1 = __importDefault(
  require('../../middlewares/validateRequest'),
);
const user_validation_1 = require('../user/user.validation');
const auth_controller_1 = require('./auth.controller');
const router = (0, express_1.Router)();
router.post(
  '/signup',
  (0, validateRequest_1.default)(
    user_validation_1.UserValidations.CreateUserValidation,
  ),
  auth_controller_1.AuthController.handelSignup,
);
exports.AuthRouter = router;
