

export const RESPONSES = {
    ERR_SYSTEM: {
        errorStatus : true, 
        errorCode: "ERROR/ERR_SYSTEM",
        errorMessage: 'Something went wrong!🤕'
    },
    EMAIL_LENGTH: {
        errorStatus: true, 
        errorCode: 'ERROR/EMAIL_LENGTH',
        errorMessage: 'Please enter a valid email address.'
    },
    EMAIL_MAX_LENGTH : {
        errorStatus: true, 
        errorCode: 'ERROR/EMAIL_LENGTH',
        errorMessage: 'Please enter a valid email address.'
    },
    EMAIL_FORMAT: {
        errorStatus: true, 
        errorCode: 'ERROR/EMAIL_FORMAT',
        errorMessage: 'Please enter a valid email address.'
    },
    SUCCESS: {
        errorStatus: false,
        errorCode: "",
        errorMessage: ""
    },
    ERR_CONNECTION: {
        errorStatus: true,
        errorCode: "ERROR/ERR_CONNECTION",
        errorMessage: "Can't connect to the server."
    },
    PASSWORD_LENGTH: {
        errorStatus: true,
        errorCode: "ERROR/PASSWORD_LENGTH",
        errorMessage: "Password must be minimum 8 characters long."
    },
    ERR_DB_CONNECTION : {
        errorStatus: true, 
        errorCode: "ERROR/DB",
        errorMessage: "Something went wrong!"
    },
    'EMAIL_AVAILABLE':{
        errorStatus: false,
        errorCode: "",
        errorMessage: "",
        emailStatus: true
    },
      EMAIL_UNAVAILABLE: {
        errorStatus: true, 
        errorCode: 'ERROR/EMAIL_UNAVAILABLE',
        errorMessage: 'A user with this email already exists.',
        emailStatus: false
    },
  
    'INVALID_REQUEST': {
        errorStatus: true, 
        errorCode: "ERROR/INVALID_REQUEST",
        errorMessage: "Invalid request."
    },
    'PASSWORD_VALID':{
        errorStatus: false,
         errorCode: "",
        errorMessage: "",
        passwordStatus: true
    },
    'USERNAME_AVAILABLE': {
        errorStatus: false,
        errorCode: "",
        errorMessage: "",
        usernameStatus: true
    },
    'USERNAME_UNAVAILABLE' : {
        errorStatus: true,
        errorCode: 'ERROR/USERNAME_UNAVAILABLE',
        errorMessage: 'Username is taken.',
        usernameStatus: false
    },

    'USER_UNAUTHORIZED': {
        errorStatus: true,
        errorCode: 'ERROR/USER_UNAUTHORIZED',
        errorMessage: 'Unauthorized.'
    },
    'USERNAME_LENGTH' : {
        errorStatus: true,
        errorCode: 'ERROR/USERNAME_LENGTH',
        errorMessage: 'Username must be 2-15 characters long..'
    },
    'USERNAME_FORMAT' : {
        errorStatus: true,
        errorCode: 'ERROR/USERNAME_FORMAT',
        errorMessage : 'Username can only contain . _ as special characters and cannot begin or end with `.` '
    },
    'IMAGE_UPLOAD_ERROR': {
        errorStatus: true,
        errorCode: 'ERROR/IMAGE_UPLOAD_ERROR',
        errorMessage: 'Couldnt complete that operation. Please try again.'
    },
    INVALID_PRIMARY_FIELD : {
      errorStatus :true,
        errorCode: 'ERROR/INVALID_PRIMARY_FIELD',
        errorMessage: 'Please enter a valid Email Address/Username'  
    },
    EMAIL_LOGIN_FAIL: {
        errorStatus :true,
        errorCode: 'ERROR/EMAIL_LOGIN_FAIL',
        errorMessage :"The email and password you entered did not match our records. Please try again."
    },
    USERNAME_LOGIN_FAIL : {
        errorStatus :true,
        errorCode: 'ERROR/USERNAME_LOGIN_FAIL',
        errorMessage :"The username and password you entered did not match our records. Please try again."
    },
    USER_NOT_FOUND_LOGIN_FAIL : {
        errorStatus :true,
        errorCode: 'ERROR/USER_NOT_FOUND_LOGIN_FAIL',
        errorMessage : "User with this account doesn't exist."
    }

    

    
}


export const BASE_DEV = "https://truffen.com/media/"
