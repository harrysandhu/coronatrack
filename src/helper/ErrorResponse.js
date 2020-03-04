"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_RESPONSE = {
    INVALID_REQUEST: {
        message: "Invalid Request.",
        type: 'INVALID_REQUEST',
        code: 400
    },
    ERR_SYS: {
        message: "Something went wrong, please try again",
        type: 'SERVER_ERROR',
        code: 101
    },
    user: {
        authException: {
            message: "Log in required.",
            type: "AUTH_EXCEPTION",
            code: 400
        }
    },
    username: {
        length: {
            message: "Username must be 3-15 characters long.",
            type: 'USERNAME_LENGTH',
            code: 422
        },
        format: {
            message: "Username can only contain . _ as special characters and cannot begin or end with `.` ",
            type: "USERNAME_FORMAT",
            code: 422
        },
        unavailable: {
            message: "Username is taken.",
            type: "USERNAME_UNAVAILABLE",
            code: 422
        }
    },
    email: {
        invalid: {
            message: "Please provide a valid email address.",
            type: "EMAIL_INVALID",
            code: 422
        },
        taken: {
            message: "An account with this email already exists.",
            type: "EMAIL_TAKEN",
            code: 422
        }
    },
    password: {
        length: {
            message: "Password must be at least 8 characters long.",
            type: "PASSWORD_LENGTH",
            code: 422
        }
    },
    category: {
        invalid: {
            message: "Invalid keyword for category.",
            type: "CATEGORY_INVALID",
            code: 322
        }
    },
    phone: {
        invalid: {
            message: "Invalid Phone Number.",
            type: "PHONE_INVALID",
            code: 322
        },
        taken: {
            message: "An account with this phone already exists.",
            type: "PHONE_TAKEN",
            code: 422
        }
    }
};
