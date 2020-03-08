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
import Symptom from './Symptom'
import {Weights} from './Weights' 
import {SymptomState} from './SymptomState'
var Geohash = require('ngeohash');


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
    static async getLocationGeohash(latitude:number, longitude:number, precision:number )
    : Promise<Result<any, Error>> 
    {
        let locationGeohash = Geohash.encode(latitude, longitude, precision);
        if(locationGeohash){
            return Promise.resolve(Result.Success(locationGeohash))
        }
        return Promise.reject(Result.Failure(ERROR_RESPONSE.ERR_SYS))
    }

    static getRange(n:number):number{
        switch(true){
            case (n <= 20):
                return 0;
            case (n > 20 && n <= 40):
                return 1;
            case ( n > 40 && n <= 60):
                return 2;
            case (n > 60 && n <= 85):
                return 3;
            default:
                return 4;
            
        }
    }

    static rangeDiff(x:number, m:number):number{
        return Helper.getRange(m) - Helper.getRange(x)
    }

    static rms(nums:Array<number>):number{
        if(nums.length > 0){
            let sqsum = 0;
           for(let i = 0; i < nums.length; i++){
                    sqsum += nums[i] * nums[i];
                }
        return Math.sqrt(sqsum/nums.length)
        }
        return 0;
    }
    
    static InfectionProbability(x:number, a:number, m:number, rd:number, np:Array<number>) : number{
        if(x <= a){
            let rmsval = Helper.rms(np);
            if(rd <= 0){
                return rmsval;
            }
            else if(rd == 1){
                return Helper.rms([rmsval, m]);
            }
            else{
                return Helper.rms([Helper.rms([rmsval, m]), rmsval, m])
            }
        }
        else{
            if(rd <= 0){
                return x;
            }
            else{
                return (x+m) /2;
            }
        }
        return x;
    }

    static async processInfectionState(d_id:string, locationGeohash:string, symptoms:any )
    : Promise<Result<any, Error>> 
    {   

     let  client = await longshot.connect()
        try{
               let x = 0, a = 0, m = 0, rd = 0;
        Object.keys(symptoms).map((symptom) =>{
            x += (symptoms[symptom]['state'] * Weights[symptom])
        })
        const neighboursArr = Geohash.neighbors(locationGeohash);

          let np:Array<number> = [];
            await client.query('BEGIN')


            /*
            * _infection neigbours near the user, reported within last 15 mins
            */
            let queryText = 'SELECT DISTINCT location_geohash, infection_probability, MIN(AGE(NOW(), at_datetime)) FROM _infection'
                +" "+ 'WHERE EXTRACT(MINUTE FROM AGE(NOW(),at_datetime)) < 15'
                +" "+'AND location_geohash IN($1, $2, $3, $4, $5, $6, $7, $8) GROUP BY location_geohash, infection_probability'
            let inserts = neighboursArr;
            let result = await client.query(queryText, inserts)
            let infProb = 0;
            if(result.rows.length == 0){
                //no neighbours, 
                infProb = x;
                //UPDATE at_datetime
                queryText = 'UPDATE _infection SET at_datetime = NOW(), location_geohash=$1 WHERE d_id=$2 AND at_datetime IN (SELECT at_datetime FROM _infection WHERE d_id=$2 ORDER BY at_datetime DESC LIMIT 1)';
                 inserts = [locationGeohash, d_id]
                let insertResult = await client.query(queryText, inserts)
                await client.query("COMMIT");
                return Promise.resolve(Result.Success({infection_probability:infProb,success:true}))
            }else{
              
                for(let i = 0; i < result.rows.length; i++){
                     np.push(result.rows[i]['infection_probability'])
                }
               
               

                m = Math.max(...np)
                let sum_np = 0
                for(let i = 0; i < np.length; i++){
                    sum_np += np[i];
                }
                a = (x + sum_np) / (np.length + 1);
                rd = Helper.rangeDiff(x, a);
                  infProb = Helper.InfectionProbability(x, a, m, rd, np);
         
            
                queryText = "INSERT INTO _infection(d_id, location_geohash, infection_probability, at_datetime)" + " "
                            + "VALUES ($1, $2, $3, NOW())"
                inserts = [d_id, locationGeohash, infProb]
                let insertResult = await client.query(queryText, inserts)
                await client.query("COMMIT");
                console.log(insertResult)
               }
              
                return Promise.resolve(Result.Success({infection_probability:infProb,success:true}))
                
            
        }catch(error){
            console.log(error)
             return Promise.reject(Result.Failure(ERROR_RESPONSE.ERR_SYS))
        }finally{
            client.release();
        }

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