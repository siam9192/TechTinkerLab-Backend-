"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.months = exports.VoteType = exports.Roles = exports.PaymentStatus = exports.Role = exports.Gender = void 0;
exports.Gender = {
    MALE: 'MALE',
    FEMALE: 'FEMALE',
    OTHER: 'OTHER',
};
exports.Role = {
    USER: 'USER',
    MODERATOR: 'MODERATOR',
    ADMIN: 'ADMIN',
};
exports.PaymentStatus = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    CANCELED: 'CANCELED',
};
exports.Roles = Object.values(exports.Role);
exports.VoteType = {
    UP: 'UP',
    DOWN: 'DOWN',
    EMPTY: '',
};
exports.months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
