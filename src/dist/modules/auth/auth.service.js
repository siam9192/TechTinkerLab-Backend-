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
exports.AuthService = void 0;
const config_1 = __importDefault(require("../../config"));
const jwt_1 = require("../../utils/jwt");
const user_service_1 = require("../user/user.service");
const user_model_1 = __importDefault(require("../user/user.model"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = require("../../utils/bcrypt");
const account_recover_request_model_1 = __importDefault(require("../account-recover-request/account-recover-request.model"));
const function_1 = require("../../utils/function");
const account_recover_email_1 = __importDefault(require("../../email/account-recover-email"));
const signup = (payload, req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        $or: [{ email: payload.email }, { username: payload.username }],
    });
    //  Checking user existence
    if (user) {
        if (user.email === payload.email) {
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'User is already exists on this email');
        }
        else if (user.username === payload.username) {
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'User is already exists on this username');
        }
        else {
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'User is already exists');
        }
    }
    payload.login_activities = [
        {
            device_info: {
                device: 'Redmi note 10',
            },
            login_date: new Date(),
        },
    ];
    const createdUser = yield user_service_1.UserService.createUserIntoDB(payload);
    const tokenPayload = {
        id: createdUser._id,
        role: createdUser.role,
    };
    // Generating access token
    const accessToken = yield (0, jwt_1.generateJwtToken)(tokenPayload, config_1.default.jwt_access_secret, '30d');
    // Generating refresh token
    const refreshToken = yield (0, jwt_1.generateJwtToken)(tokenPayload, config_1.default.jwt_refresh_token_secret, config_1.default.jwt_refresh_token_expire_time);
    return {
        accessToken,
        refreshToken,
    };
});
const signIn = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        email: payload.email,
        is_deleted: false,
    }).select('password role');
    // Checking user existence
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Account not found');
    }
    // Comparing password
    const isMatched = yield (0, bcrypt_1.bcryptCompare)(payload.password, user.password);
    // Checking is password correct
    if (!isMatched) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Wrong password');
    }
    const tokenPayload = {
        id: user._id,
        role: user.role,
    };
    // Generating access token
    const accessToken = yield (0, jwt_1.generateJwtToken)(tokenPayload, config_1.default.jwt_access_secret, '30d');
    // Generating refresh token
    const refreshToken = yield (0, jwt_1.generateJwtToken)(tokenPayload, config_1.default.jwt_refresh_token_secret, config_1.default.jwt_refresh_token_expire_time);
    return {
        accessToken,
        refreshToken,
    };
});
const getAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decode = (0, jwt_1.verifyToken)(refreshToken, config_1.default.jwt_refresh_token_secret);
        if (!decode) {
            throw new Error();
        }
        const user = yield user_model_1.default.findById(decode.id);
        if (!user) {
            throw new Error();
        }
        const tokenPayload = {
            id: user._id,
            role: user.role,
        };
        // Generating access token
        const accessToken = (0, jwt_1.generateJwtToken)(tokenPayload, config_1.default.jwt_access_secret, '30d');
        return {
            accessToken,
        };
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are unauthorized!');
    }
});
const forgetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: payload.email });
    // checking user existence
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Account not found');
    }
    // Generating otp code
    const otp = (0, function_1.generateOTP)();
    // Sending otp
    console.log(yield (0, account_recover_email_1.default)(user.email, user.personal_details.name.first_name, otp));
    payload.otp = yield (0, bcrypt_1.bcryptHash)(otp);
    const recoverRequest = yield account_recover_request_model_1.default.create(payload);
    const jwtPayload = {
        requestId: recoverRequest._id,
        email: payload.email,
    };
    //  Creating jwt secret send to client side
    const secret = (0, jwt_1.generateJwtToken)(jwtPayload, config_1.default.jwt_ac_verify_secret, '20m');
    return {
        secret,
    };
});
const verifyForgetPasswordRequest = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const decode = (yield (0, jwt_1.verifyToken)(payload.secret, config_1.default.jwt_ac_verify_secret));
    // Checking is secret successfully decoded
    if (!decode) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'something went wrong');
    }
    const user = yield user_model_1.default.findOne({ email: decode.email, is_deleted: false });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (user.is_blocked) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'You can not recover your account because your account is blocked');
    }
    const request = yield account_recover_request_model_1.default.findOne({
        _id: (0, function_1.objectId)(decode.requestId),
    });
    // Checking  account  recover existence
    if (!request) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'something went wrong');
    }
    // Matching main OTP with payload otp
    const match = yield (0, bcrypt_1.bcryptCompare)(payload.otp, request.otp);
    // checking is OTP matched
    if (!match) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Wrong OTP');
    }
    // Checking is the  request already verified
    if (request.is_verified) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'This OTP already has been used');
    }
    yield account_recover_request_model_1.default.findByIdAndUpdate(decode.requestId, {
        is_verified: true,
    });
    const jwtPayload = {
        userId: user._id.toString(),
        requestId: decode.requestId,
    };
    const secret = (0, jwt_1.generateJwtToken)(jwtPayload, config_1.default.jwt_ac_verify_secret, '20m');
    return {
        secret,
    };
});
const recoverAccount = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Decoding the secret
    const decoded = (yield (0, jwt_1.verifyToken)(payload.secret, config_1.default.jwt_ac_verify_secret));
    // Checking is the secret successfully decoded
    if (!decoded) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Something went wrong');
    }
    const request = yield account_recover_request_model_1.default.findOne({
        _id: (0, function_1.objectId)(decoded.requestId),
    });
    // Checking  account  recover existence
    if (!request) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'something went wrong');
    }
    console.log(decoded);
    const user = yield user_model_1.default.findOne({
        _id: (0, function_1.objectId)(decoded.userId),
        is_deleted: false,
    });
    // Checking user existence
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Checking is the user is blocked
    if (user.is_blocked) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'You can not recover your account because your account is blocked');
    }
    // hashing the new password
    const newPassword = yield (0, bcrypt_1.bcryptHash)(payload.password);
    const updateStatus = yield user_model_1.default.updateOne({ _id: user._id }, { password: newPassword });
    if (!updateStatus.modifiedCount) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Password couldn't be changed something went wrong");
    }
    return null;
});
exports.AuthService = {
    signup,
    signIn,
    getAccessToken,
    forgetPassword,
    verifyForgetPasswordRequest,
    recoverAccount,
};
