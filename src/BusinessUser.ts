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

import {BusinessUserInterface} from  './Interfaces/Interfaces'

export default class BusinessUser{

    private b_id:string = "";
    private email:string = "";
    private name:string = "";
    private username:string = "";
    private phone:string = "";
    private phone_ext:string = "";
    private password_hash:string = "";
    private salt:string = "";
    private profile_pic_url:string = "";
    private email_is_verified:boolean = false;
    private phone_is_verified:boolean = false;
    private u_id:string = ""
    
    static isValidBI(xx: any): xx is BusinessUserInterface {
        //return xx && xx.b_id && xx.email;
         return xx && xx.b_id && xx.u_id && xx.email && xx.name && xx.username && xx.phone && xx.phone_ext && xx.profile_pic_url && typeof(xx.email_is_verified)  === "boolean" && typeof(xx.phone_is_verified)  === "boolean" ;
    }

    constructor(init:BusinessUserInterface){
        try{
            if(init){
                if(BusinessUser.isValidBI(init)){
                    Object.assign(this, init)
                }else{
                    throw ERROR_RESPONSE.INVALID_REQUEST;
                }
            }else{
                throw ERROR_RESPONSE.INVALID_REQUEST;
            }
           
        }catch(err){
            console.log(err)
            throw ERROR_RESPONSE.INVALID_REQUEST;
        }
    }

    


    setpassword(p:string, s:string){
        this.password_hash = p;
        this.salt = s;

    }
    
    toarray(): any{
        return [
            this.b_id,
            this.name,
            this.email,
            this.username,
            this.phone,
            this.phone_ext,
            this.profile_pic_url,
            this.email_is_verified,
            this.phone_is_verified,
            this.u_id
        ]
    }

    repr(): BusinessUserInterface{
        return {
            b_id:this.b_id,
            name:this.name,
            email:this.email,
            username:this.username,
            phone:this.phone,
            phone_ext:this.phone_ext,
            profile_pic_url:this.profile_pic_url,
            email_is_verified:this.email_is_verified,
            phone_is_verified:this.phone_is_verified,
            u_id:this.u_id
        }
    }


    async signup(): Promise<Result<AuthResponse, Error>>{
        const client = await longshot.connect();

        try{
            await client.query("BEGIN");
            let queryText = {
                user: "INSERT INTO _business_user(b_id, name, email, username, phone, phone_ext, profile_pic_url, email_is_verified, phone_is_verified, signup_datetime, u_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), $10)",
                auth : "INSERT INTO auth(auth_id, password_hash, salt) VALUES($1, $2, $3)"
            }

            let inserts = {
               user: this.toarray(),
               auth: [this.u_id, this.password_hash, this.salt]
            }

            let userInsertResult = await client.query(queryText.user, inserts.user);
            await client.query("COMMIT");
            let authInsertResult = await client.query(queryText.auth, inserts.auth);
            await client.query("COMMIT");

            let buserAuthPayload = this.repr();
            let signOptions = {	
					subject: this.b_id,
					algorithm: "RS256"
				}
            let authToken = jwt.sign(buserAuthPayload, privateKey, signOptions)
            //--------LOG-------//
            console.log(authToken)
            console.log(buserAuthPayload)

            let successResponse = <AuthResponse>{
                authToken :authToken,
                success:true
            }

                return Promise.resolve(Result.Success(successResponse))

        }catch(error){
            console.log("Error at BUser.signup :: ", error)
            await client.query("ROLLBACK");
            return Promise.reject(ERROR_RESPONSE.ERR_SYS)
        }finally{
                    client.release();
            }
    }

}
