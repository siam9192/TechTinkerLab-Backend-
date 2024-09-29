'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.UserService = void 0;
const http_status_1 = __importDefault(require('http-status'));
const AppError_1 = __importDefault(require('../../Errors/AppError'));
const user_model_1 = __importDefault(require('./user.model'));
const bcrypt_1 = require('../../utils/bcrypt');
const createUserIntoDB = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
      $or: [{ email: payload.email }, { username: payload.username }],
    });
    //  Checking user existence
    if (user) {
      if (user.email === payload.email) {
        throw new AppError_1.default(
          http_status_1.default.NOT_ACCEPTABLE,
          'User is already exists on this email',
        );
      } else if (user.username === payload.username) {
        throw new AppError_1.default(
          http_status_1.default.NOT_ACCEPTABLE,
          'User is already exists on this username',
        );
      } else {
        throw new AppError_1.default(
          http_status_1.default.NOT_ACCEPTABLE,
          'User is already exists',
        );
      }
    }
    payload.password = yield (0, bcrypt_1.bcryptHash)(payload.password);
    payload.role = 'USER';
  });
exports.UserService = {
  createUserIntoDB,
};
