"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const constant_1 = require("../../utils/constant");
const NameSchema = new mongoose_1.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
});
const AddressSchema = new mongoose_1.Schema({
    city: {
        type: String,
        default: null,
    },
    state: {
        type: String,
        default: null,
    },
    country: {
        type: String,
        default: null,
    },
});
const StudySchema = new mongoose_1.Schema({
    institute: {
        type: String,
        required: true,
    },
    degree: {
        type: String,
        default: null,
    },
    fieldOfStudy: {
        type: String,
        default: null,
    },
    startYear: {
        type: Number,
        default: null,
    },
    endYear: {
        type: Number,
        default: null,
    },
    status: {
        type: String,
        enum: ['Attending', 'Graduated', 'Dropped Out', 'Completed'],
        required: true,
    },
    description: {
        type: String,
        default: null,
    },
});
const SubscriptionSchema = new mongoose_1.Schema({
    subscription: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: true,
    },
    subscription_start_date: {
        type: Date,
        required: true,
    },
    subscription_end_date: {
        type: Date,
        default: null,
    },
});
const UserNotificationSchema = new mongoose_1.Schema({
    notification: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Notification',
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
});
const UserLoginActivityLocation = new mongoose_1.Schema({
    city: {
        type: String,
        default: null,
    },
    region: {
        type: String,
        default: null,
    },
    country: {
        type: String,
        default: null,
    },
});
const LoginDeviceInfoSchema = new mongoose_1.Schema({
    device: {
        type: String,
        required: true,
    },
    os: {
        type: String,
        default: null,
    },
    browser: {
        type: String,
        default: null,
    },
});
const UserLoginActivity = new mongoose_1.Schema({
    device_info: {
        type: LoginDeviceInfoSchema,
        required: true,
    },
    ip_address: {
        type: String,
        default: null,
    },
    location: {
        type: UserLoginActivityLocation,
        default: null,
    },
    login_date: {
        type: Date,
        required: true,
    },
});
const UserPersonalDetailsSchema = new mongoose_1.Schema({
    name: { type: NameSchema, required: true },
    date_of_birth: { type: String, default: null },
    gender: {
        type: String,
        enum: ['MALE', 'FEMALE', 'OTHER'],
        default: null,
    },
    address: { type: AddressSchema, default: null },
    study: { type: StudySchema, default: null },
    profession: { type: String, default: null },
    about: { type: String, default: null }
});
const UserSchema = new mongoose_1.Schema({
    personal_details: {
        type: UserPersonalDetailsSchema,
        required: true,
    },
    profile_photo: {
        type: String,
        default: null,
    },
    profile_cover_photo: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        select: 0,
        required: true,
    },
    role: {
        type: String,
        enum: Object.values(constant_1.Role),
    },
    total_post: {
        type: Number,
        default: 0,
        min: 0,
    },
    total_follower: {
        type: Number,
        default: 0,
        min: 0,
    },
    total_following: {
        type: Number,
        default: 0,
        min: 0,
    },
    is_verified: {
        type: Boolean,
        default: false,
    },
    latest_subscription: {
        type: SubscriptionSchema,
        default: null,
    },
    notifications: {
        type: [UserNotificationSchema],
        default: [],
    },
    login_activities: {
        type: [UserLoginActivity],
        default: [],
    },
    is_blocked: {
        type: Boolean,
        default: false,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
