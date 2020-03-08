let fs = require("fs");
import express from 'express';
let data:any = express.Router();
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
import Record from '../../src/Record'
import {longshot} from '../../src/config/dbConfig'

import Error from '../../src/Interfaces/Error'
import Result from '../../src/Result'
import AuthResponse from '../../src/Interfaces/AuthResponse'
import Helper from '../../src/Helper'
import SResponse from '../../src/Interfaces/SResponse'
import {ERROR_RESPONSE} from '../../src/helper/ErrorResponse'
import {RESPONSE} from '../../src/helper/Response'

import UserAuthData from '../../src/Interfaces/UserAuthData';
import {UserInterface} from '../../src/Interfaces/Interfaces';



// /**DATABASE IMPORTS AND CONFIG */
// import AWS from 'aws-sdk';
// let aws_config:any = require("../../src/config/config")
// AWS.config.update(aws_config.aws_remote_config)

// //to create a dynamoDB instance
// //let dynamodb:any = new AWS.DynamoDB()



/*
*returns record for given date for user, 
*if record not found returns empty symptom template
*
if date not provided, returns all records
*/
data.get(
    "/record",
    verifyAuthToken,
      async (req:any, res:any) =>{
          
         try{
              let ur = <Result<any, Error>>await User.jwtVerifyUser(req.token, publicKey);
              console.log("UR: ", ur)
                if(User.isValidUI(ur.get())){
                    let u = ur.get()
                    //user is verified
                    console.log("userresult at /record: ", ur)
                    let user = new User(u);
                    if(!req.query.date){
                        let result = <Result<any, Error>>await user.getRecordByDate(req.query.date);
                        return res.json(result.get())
                    }else{
                        //all
                        let result = <Result<any, Error>>await user.getAllRecords();
                        return res.json(result.get())
                    }
                }
                throw Result.Failure(ERROR_RESPONSE.user.authException)
        }catch(error){
            return res.json(error.get())
        }
    }
)

data.get(
    "/user/latest_record",
    verifyAuthToken,
      async (req:any, res:any) =>{
          
         try{
              let ur = <Result<any, Error>>await User.jwtVerifyUser(req.token, publicKey);
              console.log("UR: ", ur)
                if(User.isValidUI(ur.get())){
                    let u = ur.get()
                    //user is verified
                    console.log("userresult at /record: ", ur)
                    let user = new User(u);
                    let result = <Result<any, Error>>await user.getLatestRecord();
                    return res.json(result.get())
                }
                throw Result.Failure(ERROR_RESPONSE.user.authException)
        }catch(error){
            return res.json(error.get())
        }
    }
)


data.get(
    "/user/record",
    verifyAuthToken,
      async (req:any, res:any) =>{
          if(!req.query.dateISO) return res.json(ERROR_RESPONSE.INVALID_REQUEST);
         try{
              let ur = <Result<any, Error>>await User.jwtVerifyUser(req.token, publicKey);
              console.log("UR: ", ur)
                if(User.isValidUI(ur.get())){
                    let u = ur.get()
                    //user is verified
                    console.log("userresult at /record: ", ur)
                    let user = new User(u);
                    let result = <Result<any, Error>>await user.getRecordByDate(req.query.dateISO);
                    return res.json(result.get())
                }
                throw Result.Failure(ERROR_RESPONSE.user.authException)
        }catch(error){
            return res.json(error.get())
        }
    }
)



/*
    record > {
        d_id
        recordDateTime,
        location
        symptoms


    }

*/

data.post(
    "/record",
    verifyAuthToken,
      async (req:any, res:any) =>{
        if(!req.body.record || !req.body.dateISO) return res.json(ERROR_RESPONSE.INVALID_REQUEST);
        let record = {...req.body.record}
        if(!Record.isValidRI(record)) return res.json(ERROR_RESPONSE.INVALID_REQUEST);
        
        try{
              let ur = <Result<any, Error>>await User.jwtVerifyUser(req.token, publicKey);
              console.log("UR: ", record)
                if(User.isValidUI(ur.get())){
                    let u = ur.get()
                    //user is verified
                    console.log("userresult at /record: ", ur)
                    let user = new User(u);
                    let result = <Result<any, Error>>await user.insertRecord(record, req.body.dateISO)
                    return res.json(result.get())
                  
                }
                throw Result.Failure(ERROR_RESPONSE.user.authException)
        }catch(error){
            return res.json(error.get())
        }
    }
)


data.get("/geohash",
    async (req:any, res:any) =>{
        if(!req.query.longitude || !req.query.latitude || !req.query.precision) 
        return res.json(ERROR_RESPONSE.INVALID_REQUEST);
        try{
            let {latitude, longitude, precision} = req.query;
            let result = <Result<any, Error>>await Helper.getLocationGeohash(latitude, longitude, precision)
            return res.json(result.get())
        }catch(error){
            return res.json(error.get())
        }
    }
 )

data.get(
    "/user/infection_probability",
    async (req:any, res:any) =>{
        if(!req.query.d_id || !req.query.locationGeohash || !req.query.symptoms) 
        return res.json(ERROR_RESPONSE.INVALID_REQUEST);
        try{
            let {d_id, locationGeohash, symptoms} = req.query
        let result = <Result<any, Error>>await Helper.processInfectionState(d_id, locationGeohash, symptoms)
        if(result){
            return res.json(result.get());
        }
        }catch(error){
             return res.json(error.get())
        }
    }
)




module.exports = data;

