let fs = require("fs");
import express from 'express';
let auth:any = express.Router();
let jwt:any = require("jsonwebtoken")
let crypto:any = require('crypto')
let sha256:any = require('js-sha256')
let privateKey:any = fs.readFileSync('./security/private.key', 'utf8')
let publicKey:any = fs.readFileSync('./security/public.key', 'utf8')
let verifyAuthToken:any = require('../../functions/helpers').verifyAuthToken;
let genVerificationCode:any = require('../../functions/helpers').genVerificationCode;
let RESPONSES:any = require('../../functions/helperConstants').RESPONSES;
let BASE_DEV:any = require('../../functions/helperConstants').BASE_DEV;

/**
    IMPORT CORE CLASSES
 */

import User from '../../src/User'
import BusinessUser from '../../src/BusinessUser'

import {BusinessUserInterface} from '../../src/Interfaces/Interfaces'

import Error from '../../src/Interfaces/Error'
import Result from '../../src/Result'
import AuthResponse from '../../src/Interfaces/AuthResponse'
import Helper from '../../src/Helper'
import SResponse from '../../src/Interfaces/SResponse'
import {ERROR_RESPONSE} from '../../src/helper/ErrorResponse'
import {RESPONSE} from '../../src/helper/Response'



// /**DATABASE IMPORTS AND CONFIG */
// import AWS from 'aws-sdk';
// let aws_config:any = require("../../src/config/config")
// AWS.config.update(aws_config.aws_remote_config)

// //to create a dynamoDB instance
// //let dynamodb:any = new AWS.DynamoDB()

auth.get(
    "/check",
    async (req:any, res:any) =>{
        if(!req.query.d_id) return res.json(ERROR_RESPONSE.INVALID_REQUEST)
        let d_id:string = req.query.d_id;
         try{
            let checkUser =  <Result<any, Error>>await User.checkIfUserExists(d_id)
            return res.json(checkUser.get())
        }catch(error){
            console.log(error)
            return res.json(ERROR_RESPONSE.INVALID_REQUEST);
        }
    })


auth.post(
    "/signup",
    async (req:any, res:any) =>{
        let user:User;
        console.log({...req.body.user})

        try{
            user = await new User({...req.body.user});
            let checkUser =  <Result<any, Error>>await User.checkIfUserExists(user.getDId())
            if(checkUser.get().success){
                return res.json(checkUser.get())
            }
        }catch(error){
            console.log(error)
            return res.json(ERROR_RESPONSE.INVALID_REQUEST);
        }

        try{
            let signUpResult = <Result<AuthResponse, Error>> await user.signup();
            if(signUpResult){
                return res.json(signUpResult.get())
            }
        }catch(error){
            console.log("error at user signup", error);
            return res.json(error.get())
        }


    }
)


module.exports = auth;
