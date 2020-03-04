import SResponse from '../Interfaces/SResponse'

export const RESPONSE = {
    username : {
        available : <SResponse>{
            message:'Username is available',
            isValid: true
        }
    },
    email: {
        valid: <SResponse>{
            message: 'Email is valid',
            isValid: true
        }
    },
    password: {
        valid :<SResponse>{
            message: "Password is valid.",
            isValid: true
        }
    },
    phone: {
        valid: <SResponse>{
            message: "Phone is valid.",
            isValid: true
        }
    }
}