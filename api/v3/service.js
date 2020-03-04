"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var express_1 = __importDefault(require("express"));
var service = express_1.default.Router();
var jwt = require("jsonwebtoken");
var crypto = require('crypto');
var sha256 = require('js-sha256');
var privateKey = fs.readFileSync('./security/private.key', 'utf8');
var publicKey = fs.readFileSync('./security/public.key', 'utf8');
var verifyAuthToken = require('../../functions/helpers').verifyAuthToken;
var genVerificationCode = require('../../functions/helpers').genVerificationCode;
var RESPONSES = require('../../functions/helperConstants').RESPONSES;
var BASE_DEV = require('../../functions/helperConstants').BASE_DEV;
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
