let fs = require("fs");
import UserAuthData from './Interfaces/UserAuthData';
let jwt:any = require('jsonwebtoken')
let crypto = require("crypto");
let sha256 = require("js-sha256");
let privateKey = fs.readFileSync("./security/private.key", "utf8");
let publicKey = fs.readFileSync("./security/public.key", "utf8");
let RESPONSES:any = require('../functions/helperConstants').RESPONSES;
import Result from './Result'
import AuthResponse from './Interfaces/AuthResponse'
import Error from './Interfaces/Error'
import SResponse from './Interfaces/SResponse'
import CategoryResult from './Interfaces/CategoryResult'
import * as FS from "./settings/FieldSettings"

import {longshot, firepool} from './config/dbConfig'
import {ERROR_RESPONSE} from './helper/ErrorResponse'
import {RESPONSE} from './helper/Response'
import User from './User'


export default class Helper{

     constructor(){}


    static genSignUpId():string{
        const length = 10;
        let seedText = "newUser";
        let chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
		seedText.toUpperCase() +
		"abcdefghijklmnopqrstuvwxyz" +
		seedText +
		"123456789";
	    let charLength = chars.length;
	    var result = "";
	    for (var i = 0; i < length; i++) {
		    result += chars[Math.floor(Math.random() * charLength)];
	    }   

    return result;
  
 
    }


    // /**	
    // * Checks and validates username.
    // * @param {string} username - username to check
    // */
    // static async checkUsername(username:string)
    // : Promise<Result<SResponse, Error>> 
    // {
    //     let fs = FS.UsernameSettings
    //     if(!username)  return Promise.reject(Result.Failure(ERROR_RESPONSE.username.invalid))
    //     //trim down spaces
    //     username = username.trim().toLowerCase();
    //     //check username length
    //     if(
    //         username.length < fs.minLength ||
    //         username.length > fs.maxLength
    //     ){
    //         return Promise.reject(Result.Failure(ERROR_RESPONSE.username.length))
    //     }else if(!fs.regex.test(username)){
    //         return Promise.reject(Result.Failure(ERROR_RESPONSE.username.format))
    //     }else{
    //         const client = await longshot.connect();
    //         try{
    //             await client.query('BEGIN')
    //             let queryText = 'SELECT username FROM user WHERE username=$1 UNION SELECT username from _business_user WHERE username=$1';
    //             let result = await client.query(queryText, [username])
    //             if(result.rows.length == 0){
    //                 return Promise.resolve(Result.Success(RESPONSE.username.available))
    //             }
    //             else{
    //                 return Promise.reject(Result.Failure((ERROR_RESPONSE.username.unavailable)))
    //             }
    //         }catch(err){
    //             console.log(err.stack)
    //             return Promise.reject(Result.Failure(ERROR_RESPONSE.username.unavailable))
    //         }finally{
    //             client.release();
    //         }
    //     }
                            
    // }

     
    /**	
    * Checks and validates email.
    * @param {string} email - email to check.
    */
    static async checkEmail(email:string)
    : Promise<Result<SResponse, Error>> 
    {
        let fs = FS.EmailSettings
        if(!email)  return Promise.reject(Result.Failure(ERROR_RESPONSE.email.invalid))
        //trim down spaces
        email = email.trim().toLowerCase();
        
        //check username length
        if(
            email.length < fs.minLength ||
            email.length > fs.maxLength
        ){
            return Promise.reject(Result.Failure(ERROR_RESPONSE.email.invalid))
        }else if(!fs.regex.test(email)){
            return Promise.reject(Result.Failure(ERROR_RESPONSE.email.invalid))
        }else{
            const client = await longshot.connect();
            try{
                await client.query('BEGIN')
                let queryText = 'SELECT email FROM user WHERE email=$1 UNION SELECT email from _business_user WHERE email=$1';
                let result = await client.query(queryText, [email])
                if(result.rows.length == 0){
                    return Promise.resolve(Result.Success(RESPONSE.email.valid))
                }
                else{
                    return Promise.reject(Result.Failure((ERROR_RESPONSE.email.taken)))
                }
            }catch(err){
                console.log(err.stack)
                return Promise.reject(Result.Failure(ERROR_RESPONSE.INVALID_REQUEST))
            }finally{
                client.release();
            }
        }
               
    }
    
    /**	
    * Checks and validates phone.
    * @param {string} phone - phone to check.
    */
    static async checkPhone(phone:string)
                    : Promise<Result<SResponse, Error>>
    {
         let fs = FS.PhoneNumberSettings
        if(!phone)  return Promise.reject(Result.Failure(ERROR_RESPONSE.phone.invalid))
        //check username length
        if(
            phone.length != fs.maxLength
        ){
            return Promise.reject(Result.Failure(ERROR_RESPONSE.phone.invalid))
        }else if(!fs.regex.test(phone)){
            return Promise.reject(Result.Failure(ERROR_RESPONSE.phone.invalid))
        }else{
            const client = await longshot.connect();
            try{
                await client.query('BEGIN')
                let queryText = 'SELECT phone FROM user WHERE phone=$1 UNION SELECT phone from _business_user WHERE phone=$1';
                let result = await client.query(queryText, [phone])
                if(result.rows.length == 0){
                    return Promise.resolve(Result.Success(RESPONSE.phone.valid))
                }
                else{
                    return Promise.reject(Result.Failure((ERROR_RESPONSE.phone.taken)))
                }
            }catch(err){
                console.log(err.stack)
                return Promise.reject(Result.Failure(ERROR_RESPONSE.INVALID_REQUEST))
            }finally{
                client.release();
            }
        }
    }

    
     /**
    * Checks and validates password.
    * @param {string} password - password to check
    * @return Result <SResponse, Error>
    */

    static async checkPassword(password:string) 
    : Promise<Result<SResponse, Error>> 
    {
        if(password){
            if(password.length < fs.minLength || password.length > fs.maxLength)
                return Promise.reject(Result.Failure(ERROR_RESPONSE.password.length))
            else
                return Promise.resolve(Result.Success(RESPONSE.password.valid))

        }

        return Promise.reject(Result.Failure(ERROR_RESPONSE.INVALID_REQUEST))
    }

 }