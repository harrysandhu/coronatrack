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

import {UserInterface} from  './Interfaces/Interfaces'
import {Gender} from './Gender'


export default class User {

    private d_id:string = "";
    private u_id:string = "";
    private age:number = 0;
    private gender:Gender = Gender.OTHER;
    private locationIsAllowed:boolean = false;
    private location:any = {};
    private infectionProbability:number = 0;

    static isValidUI(u: any): u is UserInterface {

        return u && u.d_id && u.u_id && u.age
         && u.gender 
         && typeof(u.locationIsAllowed) === "boolean";
    }


        constructor(init:UserInterface){
            try{
                if(init){
                    if(User.isValidUI(init)){
                        Object.assign(this, init)
                    }else{
                        throw ERROR_RESPONSE.INVALID_REQUEST;
                    }
                }
            }catch(e){
                console.log(e.stack)
                throw ERROR_RESPONSE.INVALID_REQUEST;
            }
        }


    static async jwtVerifyUser(requestToken:string, publicKey:string): Promise<Result<UserAuthData, Error>>{
        let userData:UserAuthData = <UserAuthData>{}
        try{
             await jwt.verify(requestToken, publicKey, (error:any, authData:UserAuthData): any =>{
                
                if(error) throw error;
                  userData = authData;
            })
        } catch(e){
            console.log(e);
            return Promise.reject(Result.Failure(ERROR_RESPONSE.user.authException));
        }

        return Promise.resolve(Result.Success(userData))
    }



/*
 private d_id:string = "";
    private u_id:string = "";
    private age:number = 0;
    private gender:Gender = Gender.OTHER;
    private locationIsAllowed:boolean = false;
    private location:any = {};
    private infectionProbability:number = 0;*/

    getDId(){
        return this.d_id;
    }

    toarray(): any{
        return [
            this.d_id,
            this.u_id,
            this.age,
            this.gender,
            this.locationIsAllowed,
            this.location,
            this.infectionProbability
        ]
    }

    repr(): UserInterface{
        let obj:any = {
            d_id:this.d_id,
            u_id:this.u_id,
            age:this.age,
            gender:this.gender,
            locationIsAllowed:this.locationIsAllowed,
            location:this.location,
            infectionProbability:this.infectionProbability
        }
       return obj;
    }

    static async checkIfUserExists(d_id:string) :  Promise<Result<any, Error>>{
        const client = await longshot.connect();

        try{
            await client.query("BEGIN")
            let queryText = 'SELECT d_id, u_id, age, gender, location_is_allowed, location, infection_probability FROM _user WHERE d_id = $1';
            let inserts = [d_id];
            let res = await client.query(queryText, inserts);
            if(res.rows.length != 0){
                console.log(res.rows);

            let userPayload:UserInterface = res.rows[0]
            let signOptions = {
                subject: userPayload.d_id,
                algorithm: "RS256"
            }
            let authToken = jwt.sign(userPayload, privateKey, signOptions)

            console.log(authToken)
            let successResponse = <AuthResponse>{
                authToken:authToken,
                success:true
            }
             return Promise.resolve(Result.Success(successResponse))
            }
            return Promise.resolve(Result.Success({success:false}))
        }catch(error){
            return Promise.reject(Result.Failure(ERROR_RESPONSE.ERR_SYS))
        }finally{
            client.release();
        }
    }

    async signup() : Promise<Result<AuthResponse, Error>>{
        const client = await longshot.connect();

        try{
            await client.query("BEGIN")
            let queryText = {
                user: 'INSERT INTO _user(d_id, u_id, age, gender, location_is_allowed, location, infection_probability, signup_datetime)' + ' '+
                        'VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())'
            }

            let inserts = {
                user: this.toarray()
            }

            let insertRes = await client.query(queryText.user, inserts.user)
            await client.query("COMMIT");
            
            let userPayload = this.repr();
            let signOptions = {
                subject: this.d_id,
                algorithm: "RS256"
            }
            let authToken = jwt.sign(userPayload, privateKey, signOptions)

            console.log(authToken)
            let successResponse = <AuthResponse>{
                authToken:authToken,
                success:true
            }
             return Promise.resolve(Result.Success(successResponse))
        }
        catch(error){
            console.log("error at user signup", error)
            await client.query("ROLLBACK")
            return Promise.reject(Result.Failure(ERROR_RESPONSE.ERR_SYS))
        }finally{
            client.release();
        }
    }
    
}

    // static async signup(user:any) : Promise<Result<AuthResponse, Error>>{
    //     const client = await firepool.connect();

    //     try{
    //         await client.query("BEGIN");
    //         //Insert into _user
    //         /*
    //             user_id,
    //             name,
    //             email_address,
    //             phone_number,
    //             is_business_user,
    //             email_is_verified false,
    //             phone_is_verified true
    //         */
    //         /*
    //             auth_id,
    //             user_id,
    //             password_hash,
    //             salt
    //          */
    //         let queryTextUser = "INSERT INTO _user (user_id, name, email_address, phone_number, is_business_user, email_is_verified, phone_is_verified, signup_datetime) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())";
    //         let userInserts = [
    //                         user.user_id, user.name, user.emailAddress,
    //                         user.phone_number, user.isBusinessUser,
    //                         user.emailIsVerified, user.phoneIsVerified
    //                     ];
    //         let userInsertResult = await client.query(queryTextUser, userInserts);
    //         await client.query("COMMIT");
    //         let queryTextAuth = "INSERT INTO _auth (auth_id, user_id, password_hash, salt) VALUES ($1, $2, $3, $4)"
    //         let authInserts = [
    //                             user.auth_id, user.user_id, user.password_hash, user.salt
    //                             ];
    //         let authInsertsResults = await client.query(queryTextAuth, authInserts);
    //         await client.query("COMMIT");
            
    //         let userAuthPayload = {
    //             auth_id: user.auth_id,
    //             user_id: user.user_id,
    //             name: user.name,
    //             email_address: user.email_address,
    //             isBusinessUser: user.isBusinessUser
    //         }

    //         	//TODO: jwt sign options
	// 			let signOptions = {	
	// 				subject: user.user_id,
	// 				algorithm: "RS256"
	// 			}
    //             let authToken = jwt.sign(userAuthPayload, privateKey, signOptions)

    //             	//--------LOG-------//
	// 			console.log(authToken)
	// 			console.log(userAuthPayload)

    //             let successResponse = <AuthResponse>{
    //                 authToken :authToken,
    //                 success:true
    //             }

    //              return Promise.resolve(Result.Success(successResponse))

    //     }catch(error){
    //         console.log("Error at User.signup :: ", error)
    //         await client.query("ROLLBACK");
    //         return Promise.reject(ERROR_RESPONSE.ERR_SYS)
    //     }finally{
    //                 client.release();
    //             }
    // }


