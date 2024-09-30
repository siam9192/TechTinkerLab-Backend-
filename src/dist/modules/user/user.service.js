"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = exports.updateProfileIntoDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const user_model_1 = __importDefault(require("./user.model"));
const bcrypt_1 = require("../../utils/bcrypt");
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //  Hashing password using bcrypt
    payload.password = yield (0, bcrypt_1.bcryptHash)(payload.password);
    payload.role = 'USER';
    return yield user_model_1.default.create(payload);
});
const getUsersFromDB = () => __awaiter(void 0, void 0, void 0, function* () { });
const getCurrentUserFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userId);
    //  Checking user existence
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const userLatestSubscription = user.latest_subscription;
    //  Checking is user verified by comparing current date and subscription end date
    const is_verified = userLatestSubscription
        ? new Date(userLatestSubscription.subscription_end_date).valueOf() <
            new Date().valueOf()
        : false;
    const data = {
        _id: user._id,
        personal_details: user.personal_details,
        email: user.email,
        role: user.role,
        is_verified,
    };
    return data;
});
const getCurrentUserLoginActivitiesFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userId);
    //  Checking user existence
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const activities = user.login_activities;
    return activities;
});
const changePasswordIntoDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userId).select('password');
    // Checking user existence
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const matchPassword = yield (0, bcrypt_1.bcryptCompare)(payload.current_password, user === null || user === void 0 ? void 0 : user.password);
    if (!matchPassword) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'You entered wrong current password');
    }
    // Hashed new password using bcrypt
    const hashedNewPassword = yield (0, bcrypt_1.bcryptHash)(payload.new_password);
    const result = yield user_model_1.default.updateOne({ _id: user._id }, { password: hashedNewPassword });
    // Checking is the password updated successfully
    if (!result.modifiedCount) {
        throw new AppError_1.default(400, 'Password could not be changed');
    }
    return true;
});
const updateProfileIntoDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updateDoc = {};
    const personal_details = payload.personal_details;
    if (personal_details === null || personal_details === void 0 ? void 0 : personal_details.name) {
        Object.entries(personal_details.name).forEach(([field, value]) => {
            updateDoc[`personal_details.name.${field}`] = value;
        });
    }
    if (personal_details === null || personal_details === void 0 ? void 0 : personal_details.address) {
        Object.entries(personal_details.address).forEach(([field, value]) => {
            updateDoc[`personal_details.address.${field}`] = value;
        });
    }
    if (personal_details === null || personal_details === void 0 ? void 0 : personal_details.study) {
        Object.entries(personal_details.study).forEach(([field, value]) => {
            updateDoc[`personal_details.study.${field}`] = value;
        });
    }
    personal_details === null || personal_details === void 0 ? true : delete personal_details.address;
    if (personal_details) {
        Object.entries(personal_details).forEach(([field, value]) => {
            updateDoc[`personal_details.${field}`] = value;
        });
    }
    return yield user_model_1.default.findByIdAndUpdate(userId, updateDoc, {
        runValidators: true,
    });
});
exports.updateProfileIntoDB = updateProfileIntoDB;
exports.UserService = {
    createUserIntoDB,
    getCurrentUserFromDB,
    changePasswordIntoDB,
    updateProfileIntoDB: exports.updateProfileIntoDB,
    getCurrentUserLoginActivitiesFromDB,
};
