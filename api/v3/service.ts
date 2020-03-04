let fs = require("fs");
import express from 'express';
let service:any = express.Router();
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




// service.get(
//     "/phone/code",
//     async (req:any, res:any) =>{
//         if(!req.query.phone || !req.query.phoneExt) return res.json(ERROR_RESPONSE.INVALID_REQUEST)
        
//      try{
//         let validateRes = <Result<SResponse, Error>>await Helper.checkPhone(req.query.phone);
//         console.log("validateRes: ", validateRes)
        
//         if(validateRes){
//             let code:number = genVerificationCode();
//             var params = {
//                 Message: "Your verification code: " + code,
//                 PhoneNumber: "+" + req.query.phoneExt + req.query.phone,
//                   MessageAttributes: {
//                 'AWS.SNS.SMS.SenderID': {
//                 'DataType': 'String',
//                 'StringValue': "HDVerify1"
//                 }
//             }
//             }
//              var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

//     publishTextPromise.then(
//         function (data) {
//             res.end(JSON.stringify({
//                                     MessageID: data.MessageId, 
//                                     code : code, 
//                                     phoneExt: req.query.phoneExt, 
//                                     phoneNumber: req.query.phone 
//                                     }));
//         })
        
//     }

//     }catch(error){
//         console.log(error)
//         return res.json(error)
//     }        
// })



module.exports = service;