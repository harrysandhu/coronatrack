"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth = express_1.default.Router();
var fs = require('fs');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var sha256 = require('js-sha256');
var privateKey = fs.readFileSync('./security/private.key', 'utf8');
var publicKey = fs.readFileSync('./security/public.key', 'utf8');
var mysql = require("mysql");
var verifyAuthToken = require('../../functions/helpers').verifyAuthToken;
var genVerificationCode = require('../../functions/helpers').genVerificationCode;
var genRandomToken = require('../../functions/helpers').genRandomToken;
var RESPONSES = require('../../functions/helperConstants').RESPONSES;
var BASE_DEV = require('../../functions/helperConstants').BASE_DEV;
require('dotenv').config();
// auth.post("/signup", async (req:any, res:any) =>{
//     let emailAddress:string;
//     let password:string;
//     let name:string;
//     let phone_number:string;
//     // let isPhone:boolean;
//     let salt:string;
//     let password_hash:string;
//     let user_id:string;
//     let auth_id:string;
//     console.log(req.body);
//     try{
//         emailAddress = req.body.emailAddress;
//         password = req.body.password;
//         name = req.body.name;
//         phone_number = req.body.phone;
//         // isPhone  = req.body.user.isPhone
//     }catch(error){  
//         console.log("error at signup", error);
//         return res.json(RESPONSES.INVALID_REQUEST)
//     }
// //  '{"user" : {
// //      "emailAddress": "sample1@x.com",
// //      "password": "123123123",
// //      "name" : "Mike",
// //      "phone_number": "17782332928"
// //  }}'
//     try{
//         let ckEmail = <Result<SResponse, Error>>await User.checkEmail(emailAddress);
//         let ckPassword = <Result<SResponse, Error>>await User.checkPassword(password);
//         salt = crypto.randomBytes(20).toString('hex');
//         password_hash = sha256.hmac(salt, password); 
//         user_id = sha256.hmac(salt, genRandomToken("thisisabunchofrandomtext", 11));
//           auth_id = sha256.hmac(salt, genRandomToken("thisisabunchofrandomtext", 11));
//         let isBusinessUser:boolean = true;
//         let emailIsVerified:boolean = false;
//         let phoneIsVerified:boolean = true;
//         let user = {
//             user_id,
//             auth_id,
//             name,
//             emailAddress,
//             phone_number,
//             password_hash,
//             salt,
//             isBusinessUser,
//             emailIsVerified,
//             phoneIsVerified
//         }
//         console.log(user)
//         //on success returns authToken
//         let signUpResult = <Result<AuthResponse, Error>>await User.signup(user);
//         if(signUpResult){
//             return res.json(signUpResult.get());
//         }
//     }catch(err){
//         console.log("error signing up", err)
//         return res.json(err.get())
//     }
// })
module.exports = auth;
