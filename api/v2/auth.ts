import express from 'express';
let auth:any = express.Router();
let fs:any = require('fs')
let jwt:any = require('jsonwebtoken')
let crypto:any = require('crypto')
let sha256:any = require('js-sha256')
let privateKey:any = fs.readFileSync('./security/private.key', 'utf8')
let publicKey:any = fs.readFileSync('./security/public.key', 'utf8')
let mysql:any = require("mysql")
let verifyAuthToken:any = require('../../functions/helpers').verifyAuthToken;
let genVerificationCode:any = require('../../functions/helpers').genVerificationCode;
let genRandomToken:any = require('../../functions/helpers').genRandomToken;
let RESPONSES:any = require('../../functions/helperConstants').RESPONSES;
let BASE_DEV:any = require('../../functions/helperConstants').BASE_DEV;

import User from '../../src/User'
import UserAuthData from '../../src/Interfaces/UserAuthData'
import AuthResponse from '../../src/Interfaces/AuthResponse'
import Error from '../../src/Interfaces/Error'
import Result from '../../src/Result'
import Helper from '../../src/Helper'
import SResponse from '../../src/Interfaces/SResponse'
import CategoryResult from '../../src/Interfaces/CategoryResult'
import DBResult from '../../src/Interfaces/DBResult'
import Category from '../../src/Category'
import CategoryInterface  from '../../src/Category'
import {ERROR_RESPONSE} from '../../src/helper/ErrorResponse'
import {RESPONSE} from '../../src/helper/Response'
import AWS from 'aws-sdk';
import {firepool} from '../../src/config/dbConfig'

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