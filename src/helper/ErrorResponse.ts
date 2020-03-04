import Error from '../Interfaces/Error'


export const ERROR_RESPONSE = {
    INVALID_REQUEST: <Error>{
        message: "Invalid Request.",
        type: 'INVALID_REQUEST',
        code: 400
    },
    ERR_SYS: <Error>{
        message: "Something went wrong, please try again",
        type: 'SERVER_ERROR',
        code: 101
    },
    user:{
        authException: <Error>{
            message: "Log in required.",
            type: "AUTH_EXCEPTION",
            code: 400
        }
    },
    username : {
        length: <Error>{
            message: "Username must be 3-15 characters long.",
            type: 'USERNAME_LENGTH',
            code: 422
        },
        format: <Error>{
            message: "Username can only contain . _ as special characters and cannot begin or end with `.` ",
            type: "USERNAME_FORMAT",
            code: 422
        },
        unavailable: <Error>{
            message: "Username is taken.",
            type: "USERNAME_UNAVAILABLE",
            code: 422
        }
    },
    email : {
        invalid: <Error>{
            message: "Please provide a valid email address.",
            type: "EMAIL_INVALID",
            code: 422
        },
        taken: <Error>{
            message: "An account with this email already exists.",
            type: "EMAIL_TAKEN",
            code: 422
        }
    },
    password: {
        length: <Error>{
            message: "Password must be at least 8 characters long.",
            type: "PASSWORD_LENGTH",
            code: 422
        }
    },
    category: {
        invalid : <Error>{
            message : "Invalid keyword for category.",
            type: "CATEGORY_INVALID",
            code: 322
        }
    },
    phone: {
        invalid: <Error>{
            message: "Invalid Phone Number.",
            type: "PHONE_INVALID",
            code: 322
        },
        taken: <Error>{
            message: "An account with this phone already exists.",
            type: "PHONE_TAKEN",
            code: 422
        }
    }
}



