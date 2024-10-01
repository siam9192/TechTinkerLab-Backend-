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
const function_1 = require("../../utils/function");
const constant_1 = require("../../utils/constant");
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //  Hashing password using bcrypt
    payload.password = yield (0, bcrypt_1.bcryptHash)(payload.password);
    payload.role = 'USER';
    return yield user_model_1.default.create(payload);
});
const getUsersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // Getting users
    const users = yield user_model_1.default.find();
    // Return the users data with customize format
    return users.map(user => (0, function_1.getCustomizeUserData)(user, true));
});
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
    var _a, _b, _c;
    const updateDoc = {};
    const personal_details = payload.personal_details;
    if (personal_details === null || personal_details === void 0 ? void 0 : personal_details.name) {
        (0, function_1.convertFieldUpdateFormat)(updateDoc, (_a = payload.personal_details) === null || _a === void 0 ? void 0 : _a.name, 'personal_details.name');
    }
    if (personal_details === null || personal_details === void 0 ? void 0 : personal_details.address) {
        (0, function_1.convertFieldUpdateFormat)(updateDoc, (_b = payload.personal_details) === null || _b === void 0 ? void 0 : _b.address, 'personal_details.address');
    }
    if (personal_details === null || personal_details === void 0 ? void 0 : personal_details.study) {
        (0, function_1.convertFieldUpdateFormat)(updateDoc, (_c = payload.personal_details) === null || _c === void 0 ? void 0 : _c.study, 'personal_details.study');
    }
    if (personal_details) {
        (0, function_1.convertFieldUpdateFormat)(updateDoc, payload.personal_details, 'personal_details', ['name', 'address']);
    }
    return yield user_model_1.default.findByIdAndUpdate(userId, updateDoc, {
        runValidators: true,
    });
});
exports.updateProfileIntoDB = updateProfileIntoDB;
const getUserLoginActivities = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userId);
    //  Checking user existence
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const activities = user.login_activities;
    return activities;
});
const changeUserRoleIntoDB = (currentUserRole, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(payload.user_id);
    // Checking user existence 
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Moderator can not change another admin role but he can change his own role
    if (user.role === constant_1.Role.ADMIN) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Admin role can not be changed because only admin can changed his own role');
    }
    // Moderator can not change another moderator or his own role 
    else if (user.role === constant_1.Role.MODERATOR && currentUserRole === constant_1.Role.MODERATOR) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Only Admin can changed his own role');
    }
    const updateStatus = yield user_model_1.default.updateOne({ _id: user._id, role: payload.role });
    if (!updateStatus.modifiedCount) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Role can not be changed.Something want wrong');
    }
    return null;
});
const changeUserBlockStatusIntoDB = (currentUserRole, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(payload.user_id);
    //  Checking user existence
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // const userRole = user.role
    const updateStatus = yield user_model_1.default.updateOne({ _id: (0, function_1.objectId)(payload.user_id) }, { is_blocked: payload.status });
    if (!updateStatus.modifiedCount) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User role can not be changed.something went wrong');
    }
    return null;
});
exports.UserService = {
    createUserIntoDB,
    getCurrentUserFromDB,
    getUsersFromDB,
    changePasswordIntoDB,
    updateProfileIntoDB: exports.updateProfileIntoDB,
    getCurrentUserLoginActivitiesFromDB,
    getUserLoginActivities,
    changeUserRoleIntoDB,
    changeUserBlockStatusIntoDB
};
